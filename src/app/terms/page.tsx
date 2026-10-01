import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Bitcoin for Creatives",
  description: "Terms of Service and Community Guidelines for Bitcoin for Creatives by BitEdu Network.",
};

export default function TermsPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">Legal</span>
          <h1 style={{ fontSize: "2.4rem", maxWidth: 600 }}>Terms of Service</h1>
          <p className="lede">
            Last updated: October 1, 2026. The rules and terms governing your use of Bitcoin for Creatives.
          </p>
        </div>
      </section>

      <section className="section-tight section-border-t">
        <div className="wrap" style={{ maxWidth: 800 }}>
          <div className="form-card" style={{ padding: "36px 40px", lineHeight: 1.7, color: "var(--ink)" }}>
            <h3 style={{ fontSize: "1.3rem", marginTop: 0 }}>1. Agreement to Terms</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              By accessing or using <b>Bitcoin for Creatives</b> (&quot;B4C&quot;), operated by <b>BitEdu Network</b>, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>2. Account Registration &amp; Security</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              To publish work or create a creator profile, you must register an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account. You agree to provide accurate and truthful profile information.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>3. Content Ownership &amp; Intellectual Property</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              <b>Creators retain full ownership and copyright of their original work.</b> By submitting creative works, design files, images, or media to Bitcoin for Creatives, you grant BitEdu Network a non-exclusive, worldwide, royalty-free license to display, feature, promote, and distribute the submitted content solely in connection with operating and marketing the platform and community showcases.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>4. Prohibited Conduct &amp; Acceptable Use</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              You agree not to upload, post, or transmit any content that:
            </p>
            <ul style={{ paddingLeft: 20, color: "var(--ink-soft)", marginBottom: 16 }}>
              <li>Infringes any third party&apos;s copyright, trademark, patent, or intellectual property rights.</li>
              <li>Contains fraudulent, defamatory, hateful, abusive, obscene, or unlawful material.</li>
              <li>Contains malware, viruses, harmful files, or attempts to gain unauthorized access to platform systems.</li>
              <li>Spams users, advertises unauthorized scams, or misrepresents participation in BitEdu Network.</li>
            </ul>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>5. Platform Moderation &amp; Project Review</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              Bitcoin for Creatives maintains a curated community showcase. BitEdu Network administrators reserve the right to review, approve, reject, modify, archive, or delete any creator profile or project submission that violates these terms or community standards.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>6. Lightning Network &amp; Peer-to-Peer Tipping</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              The platform enables peer-to-peer Lightning Network tips and payments using third-party Lightning wallets. All payments, tips, or XP awards are voluntary, peer-to-peer transactions between independent users. BitEdu Network is not a financial institution, escrow agent, or custodian.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>7. Disclaimer of Warranties &amp; Limitation of Liability</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. BitEdu Network shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the site or third-party interactions.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>8. Changes to Terms</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              We reserve the right to update or modify these Terms of Service at any time. Continued use of the platform after updates constitutes acceptance of the modified terms.
            </p>

            <div className="divider" style={{ margin: "24px 0" }} />

            <h3 style={{ fontSize: "1.3rem" }}>9. Contact &amp; Questions</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              For questions regarding these Terms of Service, please contact us via our <Link href="/support" style={{ textDecoration: "underline" }}>Support Page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
