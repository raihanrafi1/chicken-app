import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Chicken App - Order Delicious Chicken",
  description: "Order your favorite chicken dishes online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
