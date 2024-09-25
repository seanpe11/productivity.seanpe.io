import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Sean Pe's Productivity App",
  description: "Sean Pe's Productivity App",
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div className="flex items-center justify-center h-screen bg-[#071c39] relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute w-[750px] h-[750px] blur-[calc(750px/5)] bg-gradient-to-br from-[hsl(222,84%,60%)] to-[hsl(164,79%,71%)] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-[rotate_50s_cubic-bezier(0.8,0.2,0.2,0.8)_infinite]"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
