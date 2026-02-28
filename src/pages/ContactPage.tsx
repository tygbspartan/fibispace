import React from "react";
import ContactHero from "../components/contact/ContactHero";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <ContactHero />
      <CTA />
      <Footer />
    </div>
  );
};

export default ContactPage;
