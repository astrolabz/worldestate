import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "WorldEstate - Global Real Estate 3D Map",
  description: "Aggregatore globale di annunci immobiliari su globo 3D interattivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
