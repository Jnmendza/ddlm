// src/app/layout.tsx
import "./globals.css";
import { Bebas_Neue, Cherish, Open_Sans } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const cherish = Cherish({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cherish",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-openSans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`dark ${bebas.variable} ${cherish.variable} ${openSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
