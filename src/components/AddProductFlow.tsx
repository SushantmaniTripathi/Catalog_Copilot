import { useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CameraCapture } from './CameraCapture';
import { VoiceRecorder } from './VoiceRecorder';
import { ProductReview } from './ProductReview';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FlowStep = 'choose' | 'camera' | 'voice' | 'processing' | 'review';

interface ProductData {
  title: string;
  description: string;
  price: number | null;
  whatsappCopy: string;
  instagramCopy: string;
  imageBase64: string;
}

interface AddProductFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductFlow({ isOpen, onClose, onSuccess }: AddProductFlowProps) {
  const [step, setStep] = useState<FlowStep>('choose');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleClose = () => {
    setStep('choose');
    setImageBase64(null);
    setProductData(null);
    onClose();
  };

  const handleImageCapture = (base64: string) => {
    setImageBase64(base64);
    setStep('voice');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImageBase64(base64);
      setStep('voice');
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceComplete = async (transcript: string) => {
    if (!imageBase64) return;
    
    setStep('processing');
    
    try {
      const { data, error } = await supabase.functions.invoke('process-product', {
        body: { imageBase64, transcript }
      });

      if (error) throw error;

      setProductData({
        title: data.title,
        description: data.description,
        price: data.price,
        whatsappCopy: data.whatsappCopy,
        instagramCopy: data.instagramCopy,
        imageBase64: data.enhancedImageBase64 || imageBase64
      });
      setStep('review');
    } catch (err) {
      console.error('Processing error:', err);
      toast.error('Failed to process product. Please try again.');
      setStep('voice');
    }
  };

  const handlePublish = async (product: ProductData) => {
    setIsPublishing(true);
    
    try {
      // Upload image to storage
      const imageBytes = Uint8Array.from(atob(product.imageBase64), c => c.charCodeAt(0));
      const fileName = `${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageBytes, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // Save to database
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          price: product.price,
          image_url: urlData.publicUrl,
          whatsapp_copy: product.whatsappCopy,
          instagram_copy: product.instagramCopy
        });

      if (insertError) throw insertError;

      toast.success('Product published successfully!');
      handleClose();
      onSuccess();
    } catch (err) {
      console.error('Publish error:', err);
      toast.error('Failed to publish product. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Full screen views
  if (step === 'camera') {
    return (
      <CameraCapture
        onCapture={handleImageCapture}
        onClose={() => setStep('choose')}
      />
    );
  }

  if (step === 'voice' && imageBase64) {
    return (
      <VoiceRecorder
        imagePreview={imageBase64}
        onComplete={handleVoiceComplete}
        onBack={() => setStep('choose')}
      />
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Processing Product</h2>
        <p className="text-muted-foreground text-center">
          Generating listing with AI...
        </p>
      </div>
    );
  }

  if (step === 'review' && productData) {
    return (
      <ProductReview
        product={productData}
        onPublish={handlePublish}
        onBack={() => setStep('voice')}
        isPublishing={isPublishing}
      />
    );
  }

  // Choose modal
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={() => setStep('camera')}
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <Camera className="w-10 h-10 mb-2 text-primary" />
            <span className="font-medium">Camera</span>
            <span className="text-xs text-muted-foreground">Take a photo</span>
          </button>
          
          <label className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 mb-2 text-primary" />
            <span className="font-medium">Upload</span>
            <span className="text-xs text-muted-foreground">From gallery</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
