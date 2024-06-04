import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/modalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spark Board Idea",
  description: "Create, Share and Discuss Your Ideas with Others, Together!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster position="top-center" />
          <ModalProvider />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
