import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LP AI | AceleraObra",
  description:
    "Landing pages profissionais para lojas de materiais de construção e tinta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
