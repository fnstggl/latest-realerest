
import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "First-time Homebuyer",
    review: "I found my dream home at an incredible price. The process was transparent and stress-free!",
    avatar: "/lovable-uploads/3774845f-0b49-438c-a3d9-8f912f2c4c97.png"
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    review: "The below-market properties on this platform are genuine opportunities. I've already closed three deals.",
    avatar: "/lovable-uploads/4e626efe-ce87-44f2-ab7b-94f3048054bf.png"
  },
  {
    name: "Emily Rodriguez",
    role: "Property Seller",
    review: "Selling my property was seamless. The platform connected me with serious buyers quickly.",
    avatar: "/lovable-uploads/058f13ca-d5f3-4a15-b7c2-e33723793beb.png"
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TestimonialsSection: React.FC = () => {
  return (
    <motion.section
      className="py-16 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Real stories from real people who found their perfect home through our platform
          </p>
        </div>
        
        {/* Simple testimonial display without carousel component */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <p className="text-lg mb-4">{testimonial.review}</p>
              <div className="mt-4 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h5 className="mt-3 font-medium">{testimonial.name}</h5>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
