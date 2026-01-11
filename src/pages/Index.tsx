import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductFlow } from '@/components/AddProductFlow';

const Index = () => {
  const navigate = useNavigate();
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ShopVoice</h1>
            <p className="text-xs text-muted-foreground">AI Product Listings</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">List Products Fast</h2>
            <p className="text-muted-foreground">
              Take a photo, describe in any language, get professional listings for WhatsApp & Instagram
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => setShowAddProduct(true)}
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full gap-2"
              onClick={() => navigate('/products')}
            >
              <Package className="w-5 h-5" />
              My Products
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-muted-foreground border-t">
        Speak in Hindi, Marathi, Tamil or any language
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
