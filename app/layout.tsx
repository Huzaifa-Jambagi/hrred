import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { shadcn } from '@clerk/themes'
import Header from "@/components/header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Hirred - Job Portal",
  description: "Find your dream job with Hirred, the ultimate job portal connecting talent with opportunity.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
      }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${poppins.variable} antialiased`}
        >
          <div className="grid-background" />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}