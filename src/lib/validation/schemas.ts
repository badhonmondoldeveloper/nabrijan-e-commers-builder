import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createStoreSchema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  category: z.string().min(1, 'Please select a business category'),
  currency: z.string().default('BDT'),
  phone: z.string().min(11, 'Valid Bangladesh phone number required (e.g., 01712345678)'),
  address: z.string().optional(),
  logo: z.string().optional(),
  templateId: z.string().optional(),
});

export const productSchema = z.object({
  title: z.string().min(2, 'Product title is required'),
  slug: z.string().min(2),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  regularPrice: z.coerce.number().min(0, 'Price must be positive'),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  costPrice: z.coerce.number().min(0).default(0),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('ACTIVE'),
  stock: z.coerce.number().int().min(0).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  weight: z.coerce.number().min(0).default(0),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(z.string()).default([]),
  variants: z.array(
    z.object({
      title: z.string(),
      sku: z.string().optional(),
      price: z.coerce.number().min(0),
      salePrice: z.coerce.number().optional().nullable(),
      stock: z.coerce.number().int().min(0).default(0),
      attributes: z.record(z.string()),
    })
  ).default([]),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(11, 'Valid phone number is required (11 digits e.g. 017XXXXXXXX)'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  area: z.string().min(1, 'Area is required'),
  address: z.string().min(5, 'Full street address is required'),
  notes: z.string().optional(),
  paymentMethod: z.literal('COD').default('COD'),
  couponCode: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  amount: z.coerce.number().min(0),
  minPurchase: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().int().min(1).optional(),
  isFirstOrderOnly: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
