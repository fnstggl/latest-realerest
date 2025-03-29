
import { z } from "zod";

export const formSchema = z.object({
  address: z.string().min(1, {
    message: "Property address is required"
  }),
  description: z.string().min(1, {
    message: "Description is required"
  }),
  price: z.string().min(1, {
    message: "Price is required"
  }),
  marketPrice: z.string().min(1, {
    message: "Market price is required"
  }),
  city: z.string().min(2, {
    message: "City is required"
  }),
  state: z.string().min(2, {
    message: "State is required"
  }),
  zipCode: z.string().min(5, {
    message: "ZIP code is required"
  }),
  beds: z.string().min(1, {
    message: "Beds info is required"
  }),
  baths: z.string().min(1, {
    message: "Baths info is required"
  }),
  sqft: z.string().min(1, {
    message: "Square footage is required"
  }),
  propertyType: z.string().min(1, {
    message: "Property type is required"
  }),
  afterRepairValue: z.string().optional(),
  estimatedRehab: z.string().optional(),
  comparableAddress1: z.string().optional(),
  comparableAddress2: z.string().optional(),
  comparableAddress3: z.string().optional()
});
