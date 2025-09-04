import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Flyt",
  description: "Travel booking powered by Lite API",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="border-b">
          <div className="mx-auto max-w-5xl p-4 flex items-center gap-3">
            <img src="/logo.png" alt="Flyt" width={32} height={32} />
            <span className="text-lg font-semibold">Flyt</span>
          </div>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
