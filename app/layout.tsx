import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pandora PW",
  description: "Perfect World 1.3.6 Private Server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
