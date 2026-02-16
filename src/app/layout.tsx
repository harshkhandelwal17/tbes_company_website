import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google'; // Updated Font
import Layout from '@/components/Layout/Layout';

// "Plus Jakarta Sans" modern aur corporate websites ke liye best hai
const font = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-primary',
});

export const metadata = {
  title: {
    default: 'TBES Global | Leading BIM & CAD Solutions',
    template: '%s | TBES Global'
  },
  description: 'Innovative Building Information Modeling (BIM) solutions and services provider serving architects, engineers, contractors, and consultants globally.',
  keywords: ['BIM', 'CAD Services', 'Architecture', 'Engineering', 'Construction', '3D Modeling'],
  icons: {
    icon: '/favicon.ico', // Make sure you have a favicon
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tbesglobal.com',
    siteName: 'TBES Global',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${font.className} antialiased text-slate-900 bg-white`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}