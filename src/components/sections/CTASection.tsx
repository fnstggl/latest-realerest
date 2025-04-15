
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const CTASection: React.FC = () => {
  return (
    <motion.section 
      className="py-16 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto flex justify-center">
        <div className="glass-card-3d grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 backdrop-blur-lg border border-white/20 shadow-xl hover-property-card max-w-5xl w-full perspective-container">
          <div className="layer-1">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Ready to find your 
              <span className="purple-text px-3 mx-2 py-1 font-bold rounded-lg inline-block layer-2 shadow-lg glass backdrop-blur-md border border-white/20">
                dream home?
              </span>
            </h2>
            <p className="text-xl mb-8 text-foreground/80 bg-white/20 p-3 rounded-lg backdrop-blur-md shadow-md border border-white/20 layer-2">
              Get started today and discover properties below market value in your desired location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 layer-3">
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl search-glow border border-white/20 bg-white/20 transform hover:translate-y-[-3px] transition-all">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl search-glow border border-white/20 bg-white/20 transform hover:translate-y-[-3px] transition-all">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="glass-card-3d overflow-hidden rounded-xl shadow-xl perspective-container layer-2 border border-white/20 backdrop-blur-md bg-white/20">
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
