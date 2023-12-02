import type { Metadata } from "next";
import Script from "next/script";
import BasicLayout from "@/components/layouts/BasicLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BasicLayout>{children}</BasicLayout>
      </body>
      <Script src="/iconfont.js" />
    </html>
  );
}