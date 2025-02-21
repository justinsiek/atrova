import type { Metadata } from "next";
import { Domine } from "next/font/google";
import "./globals.css";

const domine = Domine({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-domine",
});

export const metadata: Metadata = {
  title: "Atrova",
  description: "AI Calendar Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${domine.variable} font-domine antialiased`}>
        {children}
      </body>
    </html>
  );
}
