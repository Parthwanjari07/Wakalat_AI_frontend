'use client';

import { EB_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useSidebarStore } from "@/store/sidebarStore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { useAuthModalStore } from "@/store/authModalStore";
import { useChatStore } from "@/store/chatStore";
import MCPConnectionPanel from "@/components/MCPConnectionPanel";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, close } = useSidebarStore();
  const { isOpen: isAuthOpen, close: closeAuth } = useAuthModalStore();
  const loadChats = useChatStore((s) => s.loadChats);

  useEffect(() => {
    document.title = "WAKALAT.AI";
    loadChats();
  }, [loadChats]);

  return (
    <html lang="en" suppressHydrationWarning className={`${ebGaramond.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/white_logo.png" />
      </head>
      <body className="font-sans grain-overlay">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                },
                success: {
                  duration: 2000,
                  iconTheme: {
                    primary: '#C8A96E',
                    secondary: '#0C0B09',
                  },
                },
              }}
            />
            <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <Header />

              <AnimatePresence>
                {isOpen && (
                  <>
                    <Sidebar key="sidebar" />
                    <motion.div
                      key="overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={close}
                      className="fixed inset-0 z-40"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </AnimatePresence>

              {children}

              <Footer />
              <MCPConnectionPanel />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
