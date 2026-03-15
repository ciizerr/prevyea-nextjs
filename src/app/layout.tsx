import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers";
import ServiceWorkerRegistration from "@/components/sw-register";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import CommandPalette from "@/components/layout/command-palette";
import { Toaster } from "sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? process.env.NEXT_PUBLIC_APP_URL 
  : process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "PU Digital Library",
  description: "Your college companion — PYQs, Notes, Syllabus & more",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PU Digital Library",
  },
  openGraph: {
    title: "PU Digital Library",
    description: "The ultimate vault for PYQs, Notes, and Syllabus.",
    type: "website",
    siteName: "PU Digital Library",
    images: [
      {
        url: "/shared-og/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PU Digital Library",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PU Digital Library",
    description: "Your college companion — PYQs, Notes, Syllabus & more",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
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
        <link rel="apple-touch-icon" href="/img-512x512.webp" />
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
              <CommandPalette />
              <ServiceWorkerRegistration />
              <PWAInstallPrompt />
              <Toaster position="top-center" richColors />
            </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
