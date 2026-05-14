import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["700", "800"], // for bold headings
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"], // for body text
});

export const metadata = {
  title: "Pg Manager | The Digital Concierge",
  description: "Experience premium rental management with Pg Manager. The elegant editorial ledger for your property business.",
};

import { Toaster } from 'react-hot-toast';
import ToastLimit from '@/components/ToastLimit';

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '16px',
              padding: '12px 24px',
            },
            error: {
              style: {
                background: '#EF4444',
                color: '#fff',
              }
            },
            success: {
              style: {
                background: '#10B981',
                color: '#fff',
              }
            }
          }}
        />
        <ToastLimit limit={3} />
        {children}
      </body>
    </html>
  );
}
