
import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  searchForm: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, searchForm }) => (
  <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90 animate-fade-in">
          {subtitle}
        </p>
        {searchForm}
      </div>
    </div>
  </section>
);

export default HeroSection;
