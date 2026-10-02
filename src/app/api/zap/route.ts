import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { lightningAddress, amountSats } = body || {};

    if (!lightningAddress || typeof lightningAddress !== "string") {
      return NextResponse.json({ error: "Lightning Address is required" }, { status: 400 });
    }

    const trimmedAddress = lightningAddress.trim();
    const parts = trimmedAddress.split("@");

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return NextResponse.json(
        { error: "Invalid Lightning Address format. Expected user@domain.com" },
        { status: 400 }
      );
    }

    const sats = Number(amountSats);
    if (isNaN(sats) || !Number.isInteger(sats) || sats <= 0) {
      return NextResponse.json(
        { error: "Sat amount must be a positive integer greater than 0" },
        { status: 400 }
      );
    }

    const [user, domain] = parts;

    // Step 1: Resolve LNURL-pay endpoint for Lightning Address
    const lnurlpUrl = `https://${domain}/.well-known/lnurlp/${encodeURIComponent(user)}`;
    const lnurlRes = await fetch(lnurlpUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);

    if (!lnurlRes || !lnurlRes.ok) {
      return NextResponse.json(
        { error: `Could not resolve Lightning Address at ${domain}. Please verify the address.` },
        { status: 400 }
      );
    }

    const lnurlData = await lnurlRes.json().catch(() => null);
    if (!lnurlData || !lnurlData.callback) {
      return NextResponse.json(
        { error: "Invalid LNURL response from Lightning Address provider" },
        { status: 400 }
      );
    }

    const minMsat = Number(lnurlData.minSendable || 1000);
    const maxMsat = Number(lnurlData.maxSendable || 1000000000000);
    const requestedMsat = sats * 1000;

    const minSats = Math.ceil(minMsat / 1000);
    const maxSats = Math.floor(maxMsat / 1000);

    if (requestedMsat < minMsat) {
      return NextResponse.json(
        { error: `Minimum amount for this address is ${minSats} sats` },
        { status: 400 }
      );
    }

    if (requestedMsat > maxMsat) {
      return NextResponse.json(
        { error: `Maximum amount for this address is ${maxSats} sats` },
        { status: 400 }
      );
    }

    // Step 2: Request BOLT11 Invoice from callback URL
    const callbackUrl = new URL(lnurlData.callback);
    callbackUrl.searchParams.append("amount", requestedMsat.toString());

    const callbackRes = await fetch(callbackUrl.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);

    if (!callbackRes || !callbackRes.ok) {
      return NextResponse.json(
        { error: "Failed to generate Lightning invoice from provider callback" },
        { status: 500 }
      );
    }

    const callbackData = await callbackRes.json().catch(() => null);
    const pr = callbackData?.pr || callbackData?.payment_request;

    if (!pr || typeof pr !== "string") {
      return NextResponse.json(
        { error: "Lightning provider did not return a valid invoice" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      pr,
      lightningAddress: trimmedAddress,
      amountSats: sats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
