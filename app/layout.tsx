import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwatchRoom — Find your kind of colour",
  description: "Try nail shades on your hand, compare your favourites and make a considered edit. Powered by YouCam AI.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
