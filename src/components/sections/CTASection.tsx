
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
      className="py-16 bg-white text-black border-t-4 border-b-4 border-black"
      initial="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to find your 
              <span className="bg-black text-white px-2 mx-2 font-bold border-2 border-black">
                dream home?
              </span>
            </h2>
            <p className="text-xl mb-8">
              Get started today and discover properties below market value in your desired location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="black" className="neo-button-primary font-bold">
                <Link to="/search">Find Homes</Link>
              </Button>
              <Button asChild variant="black" className="neo-button-secondary font-bold">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src="/lovable-uploads/90c52d44-966c-481c-bdd7-ebc3b04ffdc8.png" 
                alt="Modern home exterior at sunset with warm lighting" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
