import { useState } from 'react';
import { Copy, Check, MessageCircle, Instagram, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ProductData {
  title: string;
  description: string;
  price: number | null;
  whatsappCopy: string;
  instagramCopy: string;
  imageBase64: string;
}

interface ProductReviewProps {
  product: ProductData;
  onPublish: (product: ProductData) => void;
  onBack: () => void;
  isPublishing: boolean;
}

export function ProductReview({ product, onPublish, onBack, isPublishing }: ProductReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const displayProduct = isEditing ? editedProduct : product;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Image */}
      <div className="aspect-square bg-muted relative">
        <img
          src={`data:image/jpeg;base64,${displayProduct.imageBase64}`}
          alt={displayProduct.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 p-4 space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editedProduct.title}
              onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
              placeholder="Product title"
            />
            <Textarea
              value={editedProduct.description}
              onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
              placeholder="Description"
              rows={3}
            />
            <Input
              type="number"
              value={editedProduct.price || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value ? Number(e.target.value) : null })}
              placeholder="Price (optional)"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="text-xl font-bold">{displayProduct.title}</h1>
            {displayProduct.price && (
              <p className="text-2xl font-bold text-primary">₹{displayProduct.price}</p>
            )}
            <p className="text-muted-foreground">{displayProduct.description}</p>
          </div>
        )}

        {/* Copy Tabs */}
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="instagram" className="gap-2">
              <Instagram className="w-4 h-4" />
              Instagram
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="whatsapp" className="mt-3">
            <div className="relative">
              <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap">
                {displayProduct.whatsappCopy}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(displayProduct.whatsappCopy, 'whatsapp')}
              >
                {copiedField === 'whatsapp' ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="instagram" className="mt-3">
            <div className="relative">
              <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap">
                {displayProduct.instagramCopy}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(displayProduct.instagramCopy, 'instagram')}
              >
                {copiedField === 'instagram' ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Actions */}
      <div className="p-4 border-t flex gap-3 safe-area-inset-bottom">
        <Button variant="outline" onClick={onBack} disabled={isPublishing}>
          Back
        </Button>
        
        {isEditing ? (
          <Button onClick={handleSaveEdit} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isPublishing}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button 
              onClick={() => onPublish(editedProduct)} 
              className="flex-1"
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing...' : 'Publish Product'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
