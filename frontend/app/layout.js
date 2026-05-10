import { Inter, Barlow_Condensed, Barlow } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed'
});
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow'
});

export const metadata = {
  title: { default: 'FitZone – Premium Fitness Equipment', template: '%s | FitZone' },
  description: "Bangladesh's #1 fitness equipment store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
      <body className="bg-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#ffffff',
              border: '1px solid #2A2A2A',
              borderRadius: '0',
            },
            success: { iconTheme: { primary: '#C8FF00', secondary: '#000' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
