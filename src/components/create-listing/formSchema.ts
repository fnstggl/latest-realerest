
import { z } from "zod";

export const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  marketPrice: z.string().min(1, "Market Price is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  beds: z.string().min(1, "Beds is required"),
  baths: z.string().min(1, "Baths is required"),
  sqft: z.string().min(1, "Sqft is required"),
  propertyType: z.string().min(1, "Property type is required"),
  afterRepairValue: z.string().optional(),
  estimatedRehab: z.string().optional(),
  comparableAddress1: z.string().optional(),
  comparableAddress2: z.string().optional(),
  comparableAddress3: z.string().optional(),
  bounty: z.string().optional(),
  additionalImagesLink: z.string().optional(),
});
