import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "Focus Multus - Conference Room Booking",
  description: "Book focus and conference rooms with a credit-based system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
