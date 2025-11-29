import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "PinDrop - DIGIPIN Discovery",
  description: "Find, generate, save, and share DIGIPINs with an interactive map interface",
};

import { ToastProvider } from "@/components/ui/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
