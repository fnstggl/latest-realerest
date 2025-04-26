
import React from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';
import { Book, BookText, ListCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Guides = () => {
  const guides = [
    {
      title: "How to Buy",
      description: "Learn the process of finding and purchasing below-market properties",
      icon: Book,
      link: "/guides/buying"
    },
    {
      title: "How to Sell",
      description: "Discover how to list and sell your property quickly",
      icon: BookText,
      link: "/guides/selling"
    },
    {
      title: "How to Wholesale",
      description: "Master the art of wholesaling properties for profit",
      icon: ListCheck,
      link: "/guides/wholesale"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold italic text-center mb-4">
            Property Guides
          </h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to know about buying, selling, and wholesaling properties on our platform.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link key={guide.title} to={guide.link}>
                <Card className="h-full transition-all hover:shadow-lg border-none">
                  <CardHeader className="text-center">
                    <guide.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <CardTitle className="font-playfair text-xl font-bold">
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{guide.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default Guides;
