import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from '../components/LightRays';
import NavBar from "@/components/Navbar";
import { PostHogProvider } from "@/components/PostHogProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
import { Suspense } from "react";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const SchibstedGrotesk= Schibsted_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const MartianMono= Martian_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Events",
  description: "platform for dev's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen", "h-full", "antialiased", SchibstedGrotesk.variable, MartianMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
    <NavBar/>
<div className="absolute inset-0 top-0 z-[-1] min-h-screen">
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#00cce7"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
/>
</div>
        <main>
          {children}
        </main>
        </PostHogProvider>
        </body>
    </html>
  );
}
