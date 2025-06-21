import React, { useEffect, useRef } from "react";
import { Shield, Clock, BarChart2 } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
}

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({
  value,
  suffix = "",
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return (
    <motion.h3
      ref={ref}
      className="text-4xl font-bold text-primary-foreground mb-2 sm:text-5xl lg:text-6xl"
      animate={isInView ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, delay: 2.5 }}
    >
      0{suffix}
    </motion.h3>
  );
};

const StatItem: React.FC<StatItemProps> = ({ value, suffix, label }) => (
  <motion.div
    className="flex flex-col items-center text-center p-4"
    variants={{
      hidden: { opacity: 0, y: 30, scale: 0.8 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      },
    }}
  >
    <AnimatedCounter value={value} suffix={suffix} />
    <motion.p
      className="text-lg text-primary-foreground opacity-80 sm:text-xl"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 0.8,
          transition: { delay: 0.3, duration: 0.4 },
        },
      }}
    >
      {label}
    </motion.p>
  </motion.div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out h-full border border-border">
    <div className="text-primary mb-4">
      {/* Icon sizing for responsiveness */}
      {React.cloneElement(icon as React.ReactElement, {
        size: 48,
        className: "w-12 h-12 sm:w-16 sm:h-16",
      })}
    </div>
    <h4 className="text-xl font-semibold text-card-foreground mb-3 sm:text-2xl">
      {title}
    </h4>
    <p className="text-muted-foreground text-base leading-relaxed flex-grow">
      {description}
    </p>
  </div>
);

// Main App Component
const WhyUs: React.FC = () => {
  // Animation variants for the feature cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Initial state: invisible and slightly below
    visible: { opacity: 1, y: 0 }, // Animated state: fully visible and in place
  };

  return (
    <div className="font-sans antialiased min-h-screen">
      {/* Why Choose Aqar Zone Section */}
      <section className="py-16 px-4 text-center sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-foreground mb-6 sm:text-5xl">
            Why Choose Aqar Zone?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
            We provide exceptional service and expertise to help you find the
            perfect property.
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
            transition={{ duration: 0.6, delay: 0.3 }}
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
            transition={{ duration: 0.6, delay: 0.5 }}
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
