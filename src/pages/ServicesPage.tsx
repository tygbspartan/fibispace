import React from 'react';
import Navbar from '../components/Navbar';
import ServicesHero from '../components/services/ServicesHero';
import ServicesStrategy from '../components/services/ServicesStrategy';
import ServicesList from '../components/services/ServicesList';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <ServicesHero />
      <ServicesStrategy />
      <ServicesList />
      <CTA />
      <Footer />
    </div>
  );
};

export default ServicesPage;