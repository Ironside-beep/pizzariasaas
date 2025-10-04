import { useState } from "react";
import { Header } from "@/components/Header";
import { FloatingCart } from "@/components/FloatingCart";
import { useStore } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryNames = {
  "pizza-salgada": "🍕 Pizzas Salgadas",
  "pizza-doce": "🍰 Pizzas Doces",
  "esfirra-salgada": "🥟 Esfirras Salgadas",
  "esfirra-doce": "🧁 Esfirras Doces",
  "bebidas": "🥤 Bebidas",
};

export default function Menu() {
  const { menu } = useStore();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("pizza-salgada");

  const filteredMenu = menu.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.category === selectedCategory
  );

  const handleAddToCart = (item: any, size?: "broto" | "grande") => {
    const price = size ? (size === "broto" ? item.priceBroto : item.priceGrande) : item.price;
    
    addItem({
      id: item.id,
      name: item.name,
      size,
      price,
      observations: item.observations,
    });

    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nosso Cardápio
            </h1>
            <p className="text-muted-foreground">
              Escolha seus sabores favoritos e monte seu pedido
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar no cardápio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              {Object.entries(categoryNames).map(([key, name]) => (
                <TabsTrigger key={key} value={key}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(categoryNames).map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMenu.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Nenhum item encontrado nesta categoria
                    </div>
                  ) : (
                    filteredMenu.map((item) => (
                      <Card key={item.id} className="p-6 space-y-4 hover:shadow-warm transition-shadow">
                        <div>
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          {item.observations && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {item.observations}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          {item.priceBroto && item.priceGrande ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Broto</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-lg font-bold text-primary">
                                    R$ {item.priceBroto.toFixed(2)}
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToCart(item, "broto")}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Grande</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-lg font-bold text-primary">
                                    R$ {item.priceGrande.toFixed(2)}
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToCart(item, "grande")}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                R$ {item.price?.toFixed(2)}
                              </span>
                              <Button onClick={() => handleAddToCart(item)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <FloatingCart />
    </div>
  );
}
