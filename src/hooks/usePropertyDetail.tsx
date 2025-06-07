
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePropertyDetail = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log('Fetching property with ID:', id);
      
      const { data: property, error } = await supabase
        .from('property_listings')
        .select(`
          *,
          profiles!property_listings_user_id_fkey (
            id,
            name,
            avatar_url,
            phone_number,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      if (!property) {
        throw new Error('Property not found');
      }

      console.log('Raw property data from database:', property);

      // Transform the data to match our component expectations
      const transformedProperty = {
        id: property.id,
        title: property.title,
        price: property.price,
        listPrice: property.price, // Use price as fallback since list_price doesn't exist
        discountPercentage: 0, // Default since discount_percentage doesn't exist
        address: property.title, // Use title as fallback since address doesn't exist
        location: property.location,
        beds: property.beds,
        baths: property.baths,
        sqft: property.sqft,
        propertyType: property.property_type,
        description: property.description,
        images: property.images || [],
        additionalImages: property.additional_images || [],
        additionalImagesLink: property.additional_images_link,
        status: 'active', // Default since status doesn't exist
        reward: property.reward || 0,
        afterRepairValue: property.after_repair_value,
        estimatedRepairCost: 0, // Default since estimated_repair_cost doesn't exist
        comparableAddresses: property.comparable_addresses || [],
        userId: property.user_id,
        createdAt: property.created_at,
        updatedAt: property.updated_at,
        // Handle missing fields gracefully
        yearBuilt: null,
        lotSize: null,
        parking: null,
        seller: property.profiles ? {
          id: property.profiles.id,
          name: property.profiles.name,
          avatarUrl: property.profiles.avatar_url,
          phoneNumber: property.profiles.phone_number,
          email: property.profiles.email
        } : null
      };

      console.log('Transformed property data:', transformedProperty);
      return transformedProperty;
    },
    enabled: !!id,
  });
};
