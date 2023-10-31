import type { Metadata } from "next";

import "@/styles/globals.css";

import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/providers";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Server Actions",
    "Skateshop",
    "Skateboard",
    "Skateboarding",
    "Kickflip",
  ],
  authors: [
    {
      name: "lxgn",
      url: "https://github.com/lxgn",
    },
  ],
  creator: "lxgn",
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@ssegun_",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
              fontMono.variable,
              fontHeading.variable
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <TailwindIndicator />
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
