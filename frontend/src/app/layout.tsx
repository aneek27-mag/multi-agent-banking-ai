import type { Metadata } from "next";
import "./globals.css";
import { ToastHost } from "../components/ToastHost";

export const metadata: Metadata = {
  title: "Nexus Bank AI",
  description: "Agentic AI banking intelligence platform — SIH demo prototype (simulated data, no real banking integration).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <ToastHost />
      </body>
    </html>
  );
}