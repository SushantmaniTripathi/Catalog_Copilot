import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductFlow } from '@/components/AddProductFlow';
import { TypingTagline } from '@/components/TypingTagline';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';

const Index = () => {
  const navigate = useNavigate();
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="p-4 border-b bg-card transition-colors duration-300">
        <div className="flex items-center justify-between opacity-0 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Catalog Copilot" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="font-bold text-lg">Catalog Copilot</h1>
              <p className="text-xs text-muted-foreground">AI Product Listings</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Package className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <TypingTagline />
            <p className="text-muted-foreground">
              Transform your voice into professional product catalogs in 10 seconds
            </p>
          </div>

          <div className="space-y-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
