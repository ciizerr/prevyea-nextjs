import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers";
import ServiceWorkerRegistration from "@/components/sw-register";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PU Digital Library",
  description: "Your college companion — PYQs, Notes, Syllabus & more",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PU Digital Library",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/img-512x512.png" />
      </head>
      <body className={`${nunito.variable} font-sans antialiased bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <ServiceWorkerRegistration />
            <PWAInstallPrompt />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
