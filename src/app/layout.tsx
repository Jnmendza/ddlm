// src/app/layout.tsx
import "./globals.css";
import {
  Bebas_Neue,
  Cherish,
  Open_Sans,
  Sancreek,
  Bona_Nova_SC,
} from "next/font/google";

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

const sancreek = Sancreek({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sancreek",
});

const bonaNovaSc = Bona_Nova_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bona",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`dark ${bebas.variable} ${cherish.variable} ${openSans.variable} ${sancreek.variable} ${bonaNovaSc.variable}`}
    >
      <body>
        {children}
        <div id='lightbox-root' />
        <div id='loader-root' />
      </body>
    </html>
  );
}
