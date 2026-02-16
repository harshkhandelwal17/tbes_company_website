import Hero from '@/components/Home/Hero';
import Stats from '@/components/Home/Stats';
import About from '@/components/Home/About';
import Services from '@/components/Home/Services';
import WhyChooseUs from '@/components/Home/WhyChooseUs';
import Testimonials from '@/components/Home/Testimonials';
import ContactSection from '@/components/Home/ContactSection';

export const metadata = {
  title: 'TBES Global | Leading BIM & CAD Solutions',
  description: 'Transforming construction with precision BIM modeling, CAD drafting, and engineering consultation services.',
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">
      
      {/* 1. Hero Section: First Impression (Video/3D background) */}
      <Hero />

      {/* 2. Stats Section: Authority Build karne ke liye (Projects done, Experience) */}
      <Stats />

      {/* 3. About Section: "We are TBES Global" (Company Intro) */}
      <About />

      {/* 4. Services Section: Core Offerings (BIM, CAD, Consulting) */}
      <Services />

      {/* 5. Why Choose Us: Value Proposition (Cost, Quality, Support) */}
      <WhyChooseUs />

      {/* 6. Testimonials: Client Trust */}
      <Testimonials />

      {/* 7. Contact Section: Final Call to Action & Form */}
      <ContactSection />
      
    </main>
  );
}