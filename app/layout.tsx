import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareVerity ECM & Care Compliance System",
  description: "CareVerity ECM & Care Compliance System with CareVerity Training Academy, care operations, training, compliance and CQC evidence modules.",
  icons: {
    icon: "/branding/careverity-company-icon.png",
    apple: "/branding/careverity-company-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
