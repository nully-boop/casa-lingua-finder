import React from 'react';
import { Shield, Clock, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// StatItem Component: Renders a single statistic block
interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="flex flex-col items-center text-center p-4">
    <h3 className="text-4xl font-bold text-white mb-2 sm:text-5xl lg:text-6xl">{value}</h3>
    <p className="text-lg text-white opacity-80 sm:text-xl">{label}</p>
  </div>
);

// FeatureCard Component: Renders a single feature card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out h-full">
    <div className="text-black-500 mb-4">
      {/* Icon sizing for responsiveness */}
      {React.cloneElement(icon as React.ReactElement, { size: 48, className: "w-12 h-12 sm:w-16 sm:h-16" })}
    </div>
    <h4 className="text-xl font-semibold text-gray-800 mb-3 sm:text-2xl">{title}</h4>
    <p className="text-gray-600 text-base leading-relaxed flex-grow">{description}</p>
  </div>
);

// Main App Component
const WhyUs: React.FC = () => {
  // Animation variants for the feature cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Initial state: invisible and slightly below
    visible: { opacity: 1, y: 0 },   // Animated state: fully visible and in place
  };

  return (
    <div className="font-sans antialiased min-h-screen">
      {/* Statistics Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-12 px-4 shadow-lg sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          <StatItem value="1000+" label="Properties Listed" />
          <StatItem value="850+" label="Properties Sold" />
          <StatItem value="500+" label="Happy Clients" />
          <StatItem value="15+" label="Cities Covered" />
        </div>
      </section>

      {/* Why Choose PropertyHub Section */}
      <section className="py-16 px-4 text-center sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 sm:text-5xl">
            Why Choose PropertyHub?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed sm:text-xl">
            We provide exceptional service and expertise to help you find the perfect property.
          </p>
        </div>
      </section>

      {/* Feature Cards Section with Animations */}
      <section className="pb-16 px-4 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible" // Animate when the element comes into view
            viewport={{ once: true, amount: 0.8 }} // Only animate once, when 80% visible
            transition={{ duration: 0.6, delay: 0.1 }} // Animation duration and delay
          >
            <FeatureCard
              icon={<Shield />}
              title="Trusted Platform"
              description="All listings are verified and sellers are authenticated for your security."
            />
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }} // Staggered delay
          >
            <FeatureCard
              icon={<Clock />}
              title="24/7 Support"
              description="Our dedicated team is here to help you every step of the way."
            />
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, delay: 0.5 }} // Staggered delay
          >
            <FeatureCard
              icon={<BarChart2 />}
              title="Market Insights"
              description="Get access to real-time market data and pricing insights."
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
