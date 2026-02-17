import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pandora PW — Империя начинается",
  description:
    "Perfect World 1.3.6 x150. PvP / PvE баланс. Марафоны до 50 000₽. Открытие 6 марта 2026.",

  openGraph: {
    title: "Pandora PW — Империя начинается",
    description:
      "Perfect World 1.3.6 x150 • PvP / PvE баланс • Марафоны до 50 000₽ • Старт 6 марта 2026",
    url: "https://pandora-pw.ru",
    siteName: "Pandora PW",
    images: [
      {
        url: "https://pandora-pw.ru/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Pandora PW — Империя начинается",
    description:
      "Perfect World 1.3.6 x150 • PvP / PvE баланс • Марафоны до 50 000₽",
    images: ["https://pandora-pw.ru/og-image.jpg"],
  },
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
