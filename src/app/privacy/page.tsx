import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Bitcoin for Creatives",
  description: "Privacy Policy for Bitcoin for Creatives by BitEdu Network.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">Legal</span>
          <h1 style={{ fontSize: "2.4rem", maxWidth: 600 }}>Privacy Policy</h1>
          <p className="lede">
            Last updated: October 1, 2026. How we collect, use, and protect your information at Bitcoin for Creatives.
          </p>
        </div>
      </section>

      <section className="section-tight section-border-t">
        <div className="wrap" style={{ maxWidth: 800 }}>
          <div className="form-card" style={{ padding: "36px 40px", lineHeight: 1.7, color: "var(--ink)" }}>
            <h3 style={{ fontSize: "1.3rem", marginTop: 0 }}>1. Introduction</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              Welcome to <b>Bitcoin for Creatives</b> (&quot;B4C&quot;), an initiative by <b>BitEdu Network</b>. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform and use our services.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>2. Information We Collect</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              We collect information to provide better services to all users of Bitcoin for Creatives:
            </p>
            <ul style={{ paddingLeft: 20, color: "var(--ink-soft)", marginBottom: 16 }}>
              <li><b>Account Information:</b> Email address and encrypted password when you register an account.</li>
              <li><b>Creator Profile Data:</b> Display name, country, creative category, bio, skills, portfolio links, social media handles, and profile photo.</li>
              <li><b>Project Submissions:</b> Project titles, descriptions, stories, external links, tags, and uploaded media/files.</li>
              <li><b>Lightning Network Data:</b> Public Lightning addresses provided to enable peer-to-peer appreciation or tipping.</li>
              <li><b>Usage &amp; Technical Data:</b> Browser type, device details, IP address, and standard server log data for performance and security monitoring.</li>
            </ul>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>3. How We Use Your Information</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              We use the collected information for the following purposes:
            </p>
            <ul style={{ paddingLeft: 20, color: "var(--ink-soft)", marginBottom: 16 }}>
              <li>To operate, maintain, and display your public creator profile and showcase your projects.</li>
              <li>To authenticate users and secure account access.</li>
              <li>To facilitate community interaction, XP awards, and Lightning Network support.</li>
              <li>To review, moderate, and publish submitted works.</li>
              <li>To communicate platform updates, security alerts, and administrative messages.</li>
            </ul>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>4. Public Display of Information</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              Bitcoin for Creatives is a public showcase directory. Information published in your Creator Profile (such as display name, bio, skills, portfolio links, profile photo, and public Lightning address) and published Projects are visible to all visitors of the website. Please do not share private information in public profile fields.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>5. Data Sharing and Third Parties</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes. We may share data only with trusted service providers essential for platform operations (e.g., hosting infrastructure, database management, and cloud storage providers) under strict confidentiality standards.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>6. Bitcoin &amp; Lightning Network Transactions</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              Lightning Network interactions (tips, payments, or value transfers) occur directly between peer users or third-party Lightning wallets. Bitcoin for Creatives does not store private keys, custodial funds, or financial secrets.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>7. Data Retention &amp; Your Rights</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              You have the right to access, edit, or delete your creator profile and submitted projects at any time through your account settings or by contacting platform support. We retain personal data as long as your account remains active or as required for security and administrative purposes.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>8. Contact Us</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              If you have questions, concerns, or requests regarding this Privacy Policy or data protection, please reach out to us via our <Link href="/support" style={{ textDecoration: "underline" }}>Support Page</Link> or official BitEdu Network channels.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
