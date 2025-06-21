import React, { useEffect, useRef } from "react";
import { Button } from '../ui/button';
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, MapPin, Building, Users } from "lucide-react";

// Interfaces for animated statistics
interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
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
      className="text-3xl font-bold text-primary mb-2 sm:text-4xl lg:text-5xl"
      animate={isInView ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, delay: 2.5 }}
    >
      0{suffix}
    </motion.h3>
  );
};

// Animated statistic item component
const StatItem: React.FC<StatItemProps> = ({ value, suffix, label, icon }) => (
  <motion.div
    className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-300"
    variants={{
      hidden: { opacity: 0, y: 30, scale: 0.8 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      }
    }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <motion.div
      className="text-primary mb-4 p-3 bg-primary/10 rounded-full"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
    >
      {React.cloneElement(icon as React.ReactElement, {
        size: 32,
        className: "w-8 h-8",
      })}
    </motion.div>
    <AnimatedCounter value={value} suffix={suffix} />
    <motion.p
      className="text-sm text-muted-foreground font-medium"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { delay: 0.3, duration: 0.4 }
        }
      }}
    >
      {label}
    </motion.p>
  </motion.div>
);

const BoloForm = () => {
  return (
    <div className="bg-background min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Property Management Dashboard
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Comprehensive real estate analytics across Syria
          </motion.p>
        </motion.div>

        {/* Animated Statistics Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="grid grid-cols-2 gap-6 lg:grid-cols-4 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <StatItem
              value={1247}
              label="Total Properties"
              icon={<Building />}
            />
            <StatItem
              value={89}
              label="Active Listings"
              icon={<TrendingUp />}
            />
            <StatItem
              value={156}
              suffix="+"
              label="Happy Clients"
              icon={<Users />}
            />
            <StatItem
              value={12}
              label="Cities Covered"
              icon={<MapPin />}
            />
          </motion.div>
        </motion.section>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Property Info Panel */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Property Stats Card */}
            <motion.div
              className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">Property Overview</h3>
                    <p className="text-sm text-muted-foreground">Total properties: 128</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border p-5">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <motion.div
                    className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-xl font-bold text-success">89</p>
                  </motion.div>
                  <motion.div
                    className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-xs text-muted-foreground">Maintenance</p>
                    <p className="text-xl font-bold text-warning">21</p>
                  </motion.div>
                  <motion.div
                    className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-xs text-muted-foreground">Vacant</p>
                    <p className="text-xl font-bold text-primary">12</p>
                  </motion.div>
                  <motion.div
                    className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-xs text-muted-foreground">Rented</p>
                    <p className="text-xl font-bold text-secondary-foreground">6</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
            >
              <div className="p-5">
                <motion.h3
                  className="text-lg font-medium text-card-foreground mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Quick Actions
                </motion.h3>
                <motion.div
                  className="space-y-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center group">
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </motion.svg>
                      Add New Property
                      </Button>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center group"
                      >
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </motion.svg>
                      View All Properties
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="p-5 border-b border-border"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-medium text-card-foreground">Property Locations</h3>
                <p className="mt-1 text-sm text-muted-foreground">Interactive map of all properties in Syria</p>
              </motion.div>
              
              <motion.div
                className="relative h-[500px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Syria Map Image */}
                <motion.img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/94/Syria_location_map.svg"
                  alt="Syria Map"
                  className="w-full h-full object-contain"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1 }}
                />

                {/* Property Markers */}
                <motion.div
                  className="absolute bottom-[25%] left-[32%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-success rounded-full relative shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.7)",
                        "0 0 0 10px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border shadow-md whitespace-nowrap">
                      Damascus - 42 Properties
                    </span>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute top-[30%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-success rounded-full relative shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.7)",
                        "0 0 0 10px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border shadow-md whitespace-nowrap">
                      Aleppo - 28 Properties
                    </span>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute top-[60%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.9 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <motion.div
                    className="w-4 h-4 bg-success rounded-full relative shadow-lg"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.7)",
                        "0 0 0 10px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border shadow-md whitespace-nowrap">
                      Homs - 19 Properties
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="p-5 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="flex items-center space-x-4 flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 2.4
                      }
                    }
                  }}
                >
                  <motion.div
                    className="flex items-center cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-success rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                    <span className="text-sm text-muted-foreground">Active Properties</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-warning rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    ></motion.div>
                    <span className="text-sm text-muted-foreground">Under Maintenance</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-primary rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    ></motion.div>
                    <span className="text-sm text-muted-foreground">Vacant Properties</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BoloForm;