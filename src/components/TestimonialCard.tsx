
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  rating,
  image,
}) => {
  return (
    <Card className="glass-card overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex gap-4 items-start">
          <img
            src={image}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < rating ? "fill-primary text-primary" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="mt-3 text-foreground/80">{content}</p>
            <div className="mt-4">
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-sm text-foreground/60">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
