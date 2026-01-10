-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  whatsapp_copy TEXT,
  instagram_copy TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read access for products (buyers can view)
CREATE POLICY "Products are publicly viewable"
ON public.products
FOR SELECT
USING (true);

-- Public insert for products (no auth required for hackathon)
CREATE POLICY "Anyone can create products"
ON public.products
FOR INSERT
WITH CHECK (true);

-- Public update for products
CREATE POLICY "Anyone can update products"
ON public.products
FOR UPDATE
USING (true);

-- Public read access for orders
CREATE POLICY "Orders are publicly viewable"
ON public.orders
FOR SELECT
USING (true);

-- Public insert for orders (buyers can place orders)
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Allow public read access to product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'products');

-- Allow anyone to upload product images
CREATE POLICY "Anyone can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'products');