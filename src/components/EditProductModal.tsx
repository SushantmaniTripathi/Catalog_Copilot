import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  whatsapp_copy: string | null;
  instagram_copy: string | null;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductModal({ product, isOpen, onClose, onSuccess }: EditProductModalProps) {
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [whatsappCopy, setWhatsappCopy] = useState(product?.whatsapp_copy || '');
  const [instagramCopy, setInstagramCopy] = useState(product?.instagram_copy || '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync form when product changes
  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setPrice(product.price?.toString() || '');
      setWhatsappCopy(product.whatsapp_copy || '');
      setInstagramCopy(product.instagram_copy || '');
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          price: price ? Number(price) : null,
          whatsapp_copy: whatsappCopy.trim() || null,
          instagram_copy: instagramCopy.trim() || null,
        })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Copy</Label>
            <Textarea
              id="whatsapp"
              value={whatsappCopy}
              onChange={(e) => setWhatsappCopy(e.target.value)}
              placeholder="WhatsApp marketing copy"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Copy</Label>
            <Textarea
              id="instagram"
              value={instagramCopy}
              onChange={(e) => setInstagramCopy(e.target.value)}
              placeholder="Instagram marketing copy"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}