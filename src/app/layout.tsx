import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import { SidebarProvider } from "@/context/SidebarContext";
import ToastProvider from "../providers/ToastProvider";
import { AppProviders } from "../providers/app-providers";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SCTC",
    default: "Sáng Cà Tối Cồn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className}  dark:bg-gray-900`}>
        <AppProviders>
          <SidebarProvider>
            {children}
            <ToastProvider />
          </SidebarProvider>
        </AppProviders>
      </body>
    </html>
  );
}
