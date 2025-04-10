import React from 'react';
import { Phone, Mail } from 'lucide-react';
interface SellerContactInfoProps {
  name?: string;
  phone?: string | null;
  email?: string | null;
  showContact: boolean;
}

// Format phone number in a consistent way
const formatPhoneNumber = (phoneNumber: string | null | undefined): string | null => {
  if (!phoneNumber) return null;
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length < 10) return phoneNumber;
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};
const SellerContactInfo: React.FC<SellerContactInfoProps> = ({
  name = 'Property Owner',
  phone,
  email,
  showContact
}) => {
  console.log("SellerContactInfo rendering with:", {
    name,
    phone,
    email,
    showContact
  });
  if (!showContact) {
    return null;
  }
  return <div className="border-2 border-black p-4 mt-6">
      <h3 className="font-bold mb-2">Contact Seller</h3>
      <p className="mb-1">{name}</p>
      
      {phone && <div className="flex items-center">
          <Phone size={16} className="mr-2" />
          <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
            {formatPhoneNumber(phone)}
          </a>
        </div>}
      
      {email && <div className="flex items-center mt-1">
          <Mail size={16} className="mr-2" />
          <a href={`mailto:${email}`} className="text-blue-900 hover:underline">
            {email}
          </a>
        </div>}
      
      {!phone && !email && <p className="text-gray-500 italic">No contact information available</p>}
    </div>;
};
export default SellerContactInfo;