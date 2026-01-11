import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Sparkles, Camera, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductFlow } from '@/components/AddProductFlow';

const Index = () => {
  const navigate = useNavigate();
  const [showAddProduct, setShowAddProduct] = useState(false);

  const features = [
    {
      icon: Camera,
      title: 'Snap Photo',
      description: 'Take a quick photo of your product'
    },
    {
      icon: MessageSquare,
      title: 'Speak Details',
      description: 'Describe in any language you prefer'
    },
    {
      icon: Share2,
      title: 'Share Instantly',
      description: 'Get ready-to-post content for social'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Catalog Copilot</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Product Listings</p>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col">
        <div className="px-5 pt-8 pb-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Create Product Listings
              <span className="block gradient-text">in Seconds</span>
            </h2>
            
            <p className="text-muted-foreground max-w-xs mx-auto">
              Snap a photo, speak in any language, get professional listings for WhatsApp & Instagram
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-5 py-6">
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="px-5 py-6 mt-auto">
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full h-14 text-base font-semibold gap-2 gradient-primary border-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => setShowAddProduct(true)}
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-12 gap-2 font-medium"
              onClick={() => navigate('/products')}
            >
              <Package className="w-5 h-5" />
              View My Catalog
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-4 text-center border-t">
        <p className="text-xs text-muted-foreground">
          🌍 Speak in Hindi, Marathi, Tamil, or any language
        </p>
      </footer>

      <AddProductFlow
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Index;
