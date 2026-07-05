import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";
import LoanProcess from "@/components/home/LoanProcess";
import Testimonials from "@/components/home/Testimonials";
import EMIBanner from "@/components/home/EMIBanner";
import CibilBanner from "@/components/home/CibilBanner";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <LoanProcess />
      <Testimonials />
      <EMIBanner />
      <CibilBanner />
      <ContactSection />
    </>
  );
}
