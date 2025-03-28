
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, ShoppingCart, Info, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProperties from '@/components/sections/FeaturedProperties';
import CTASection from '@/components/sections/CTASection';
import SiteFooter from '@/components/sections/SiteFooter';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <CTASection />
      <SiteFooter />
    </div>
  );
};

export default Index;
