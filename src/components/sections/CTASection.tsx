
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Remove animations
const fadeInUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } }
};

const CTASection: React.FC = () => {
  return (
    <motion.section 
      className="py-16 relative overflow-hidden"
      initial="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      {/* No need for gradient background shapes as they're in the Index component */}
      
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="glass-card grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Ready to find your 
              <span className="glass-gradient-orange px-2 mx-2 font-bold rounded-lg text-white inline-block">
                dream home?
              </span>
            </h2>
            <p className="text-xl mb-8 text-foreground/80">
              Get started today and discover properties below market value in your desired location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="black" className="font-bold">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="glass" className="font-bold">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="glass overflow-hidden rounded-xl">
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src="/lovable-uploads/90c52d44-966c-481c-bdd7-ebc3b04ffdc8.png" 
                alt="Modern home exterior at sunset with warm lighting" 
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
