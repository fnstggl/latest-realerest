
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
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="glass-card grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 backdrop-blur-lg border border-white/30 shadow-2xl perspective-container">
          <div className="layer-1">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Ready to find your 
              <span className="glass-gradient-orange px-3 mx-2 py-1 font-bold rounded-lg text-white inline-block layer-2 shadow-lg">
                dream home?
              </span>
            </h2>
            <p className="text-xl mb-8 text-foreground/80">
              Get started today and discover properties below market value in your desired location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="glass" className="font-bold shadow-lg backdrop-blur-xl">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="glass overflow-hidden rounded-xl shadow-2xl perspective-container">
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src="/lovable-uploads/90c52d44-966c-481c-bdd7-ebc3b04ffdc8.png" 
                alt="Modern home exterior at sunset with warm lighting" 
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
            <div className="absolute -bottom-5 -right-5 glass-dark p-4 rounded-lg shadow-xl max-w-[200px] layer-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Exclusive Deal</span>
              </div>
              <p className="text-xs opacity-80">Limited time offer on premium properties</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
