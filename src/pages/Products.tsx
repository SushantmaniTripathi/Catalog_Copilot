import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Eye, Plus, Package, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AddProductFlow } from '@/components/AddProductFlow';

interface Product {
  id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  created_at: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, image_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCopyLink = async (productId: string) => {
    const url = `${window.location.origin}/p/${productId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(productId);
      toast.success('Link copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg tracking-tight">My Catalog</h1>
            <p className="text-xs text-muted-foreground">{products.length} products</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowAddProduct(true)}
            className="rounded-xl gradient-primary border-0 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Loading catalog...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No products yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Add your first product to get started</p>
            <Button 
              onClick={() => setShowAddProduct(true)}
              className="rounded-xl gradient-primary border-0 shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {products.map((product) => (
              <Card key={product.id} className="flex overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-muted flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent">
                      <Package className="w-8 h-8 text-accent-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-semibold truncate">{product.title}</h3>
                    {product.price && (
                      <p className="text-primary font-bold">₹{product.price.toLocaleString()}</p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-lg flex-1"
                      onClick={() => navigate(`/p/${product.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-lg flex-1"
                      onClick={() => handleCopyLink(product.id)}
                    >
                      {copiedId === product.id ? (
                        <Check className="w-4 h-4 mr-1 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copiedId === product.id ? 'Copied!' : 'Share'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AddProductFlow
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default Products;
