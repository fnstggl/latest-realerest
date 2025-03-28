
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  marketPrice: number;
  image: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  belowMarket: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  marketPrice,
  image,
  location,
  beds,
  baths,
  sqft,
  belowMarket,
}) => {
  return (
    <Card className="overflow-hidden rounded-xl border-none shadow-md hover:shadow-lg transition-shadow hover-scale animate-enter">
      <Link to={`/property/${id}`}>
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-donedeal-orange text-white font-medium text-xs">
            {belowMarket}% Below Market
          </Badge>
          <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors">
            <Heart size={18} className="text-donedeal-dark-gray hover:text-red-500 transition-colors" />
          </button>
        </div>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-bold text-donedeal-navy">
                ${price.toLocaleString()}
              </p>
              <p className="text-sm line-through text-gray-500">
                ${marketPrice.toLocaleString()}
              </p>
            </div>
            <h3 className="mt-1 text-base font-medium text-donedeal-dark-gray truncate">
              {title}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{location}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2">
              <div className="flex items-center text-sm text-gray-600">
                <Bed size={16} className="mr-1" />
                <span>{beds} bd</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Bath size={16} className="mr-1" />
                <span>{baths} ba</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Square size={16} className="mr-1" />
                <span>{sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PropertyCard;
