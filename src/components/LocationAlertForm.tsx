
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const LocationAlertForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    maxPrice: '',
    propertyType: '',
    isAgent: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('location_alerts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location,
          max_price: formData.maxPrice ? parseInt(formData.maxPrice) : null,
          property_type: formData.propertyType || null,
          is_agent: formData.isAgent
        }]);

      if (error) throw error;

      toast.success("Alert created! We'll notify you when properties match your criteria.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        maxPrice: '',
        propertyType: '',
        isAgent: false
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create alert");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="text-2xl font-bold text-[#01204b] mb-2">Early Access</h3>
      <p className="text-gray-600 mb-6">
        Get notified when new below-market properties become available in your area.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Preferred Location *</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State or ZIP"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">Max Price (Optional)</Label>
            <Input
              id="maxPrice"
              type="number"
              value={formData.maxPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
              placeholder="500000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">Property Type (Optional)</Label>
            <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAgent"
            checked={formData.isAgent}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAgent: checked as boolean }))}
          />
          <Label htmlFor="isAgent" className="text-sm text-gray-700">
            I am a real estate agent
          </Label>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full md:w-auto bg-white border-2 border-[#fd4801] text-[#fd4801] hover:bg-[#fd4801] hover:text-white transition-all font-medium"
        >
          {isLoading ? 'Creating Alert...' : 'Get Early Access'}
        </Button>
      </form>
    </div>
  );
};

export default LocationAlertForm;
