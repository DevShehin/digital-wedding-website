import "./globals.css";

import { wedding } from "./wedding-data";

export const metadata = {
  title: `${wedding.couple.groom} & ${wedding.couple.bride} | Wedding Invitation`,

  description:
    "With love and the blessings of our families, join Karthik and Revathy as they begin their forever.",

  openGraph: {
    title: `${wedding.couple.groom} & ${wedding.couple.bride} — Wedding Invitation`,

    description:
      "Two hearts, one beautiful beginning. Join us for our wedding celebration.",

    images: ["/images/uk-photoshoot-2.jpeg"],
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: `${wedding.couple.groom} & ${wedding.couple.bride} — Wedding Invitation`,
    description: "Join us as we begin our forever."
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}