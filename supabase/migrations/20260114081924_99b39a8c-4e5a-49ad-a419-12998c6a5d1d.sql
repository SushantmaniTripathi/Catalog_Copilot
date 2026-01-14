-- Allow anyone to delete products
CREATE POLICY "Anyone can delete products" 
ON public.products 
FOR DELETE 
USING (true);