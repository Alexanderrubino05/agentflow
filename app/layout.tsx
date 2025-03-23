import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/packages/trpc/react";

export const metadata: Metadata = {
  title: "Adikopas",
  description: "Create your orders for Adikopas",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider cookies={(await cookies()).toString()}>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
