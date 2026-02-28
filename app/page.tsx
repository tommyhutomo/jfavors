import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Services } from '@/components/Services';
import { PortfolioCarousel } from '@/components/PortfolioCarousel';
import { CTA } from '@/components/CTA';

export default function Home() {
  return (
    <div className="pastel-gradient">
      <Hero />
      <Features />
      <Services />
      <PortfolioCarousel />
      <CTA />
    </div>
  );
}
