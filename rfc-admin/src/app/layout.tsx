import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/layout/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Toast from "@/components/shared/Toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: "Gravity Fitness - Admin Console",
  description: "Premium fitness management dashboard for Regent Fitness Club (RFC).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-surface text-on-surface antialiased overflow-x-hidden selection:bg-primary/20">
        <AuthProvider>
          <AuthGuard>
            <div className="app-layout">
              <Sidebar />
              <div className="main-area">
                <Header />
                <main className="page-content min-h-[calc(100vh-64px)]">
                  {children}
                </main>
              </div>
            </div>
          </AuthGuard>
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
