import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Easy Test",
  description: "Application for testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-neutral-100 antialiased">
        <AuthProvider>
          <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
