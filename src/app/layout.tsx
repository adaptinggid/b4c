import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Bitcoin for Creatives (B4C)",
  description:
    "A growing movement creating space for creatives to explore Bitcoin, showcase their skills and connect with others in the ecosystem. An initiative by BitEdu Network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Nav />
          <main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
