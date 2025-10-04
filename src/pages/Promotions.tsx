import { Header } from "@/components/Header";
import { FloatingCart } from "@/components/FloatingCart";
import { useStore } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Promotions() {
  const { promotions, menu } = useStore();
  const { addItem } = useCart();

  const handleAddPromotion = (promo: any) => {
    addItem({
      id: `promo-${promo.id}`,
      name: promo.name,
      price: promo.price,
      observations: `Promoção: ${promo.items.map((id: string) => {
        const item = menu.find(m => m.id === id);
        return item?.name;
      }).join(", ")}`,
    });

    toast.success(`Promoção "${promo.name}" adicionada ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 mb-4">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="font-medium text-secondary">Ofertas Especiais</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Promoções
            </h1>
            <p className="text-muted-foreground">
              Aproveite nossas ofertas imperdíveis!
            </p>
          </div>

          {promotions.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma promoção disponível</h3>
              <p className="text-muted-foreground">
                Em breve teremos ofertas especiais para você!
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promo) => (
                <Card key={promo.id} className="p-6 space-y-4 hover:shadow-warm transition-shadow border-primary/20">
                  <div className="flex items-start justify-between">
                    <Sparkles className="h-6 w-6 text-secondary" />
                    <span className="text-xs font-bold px-2 py-1 bg-secondary/20 text-secondary rounded-full">
                      PROMOÇÃO
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-2">{promo.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium">Inclui:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {promo.items.map((itemId) => {
                          const item = menu.find((m) => m.id === itemId);
                          return item ? <li key={itemId}>{item.name}</li> : null;
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground line-through">
                        De R$ {(promo.items.reduce((sum, itemId) => {
                          const item = menu.find(m => m.id === itemId);
                          return sum + (item?.priceGrande || item?.price || 0);
                        }, 0)).toFixed(2)}
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        R$ {promo.price.toFixed(2)}
                      </p>
                    </div>
                    <Button onClick={() => handleAddPromotion(promo)} size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      Adicionar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <FloatingCart />
    </div>
  );
}
