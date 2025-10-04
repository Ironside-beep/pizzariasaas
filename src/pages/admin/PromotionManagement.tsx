import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStore, Promotion } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PromotionManagement() {
  const { isAuthenticated } = useAuth();
  const { menu, promotions, addPromotion, updatePromotion, removePromotion } = useStore();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    items: [] as string[],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      items: [],
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      name: promo.name,
      price: promo.price.toString(),
      items: promo.items,
    });
    setIsDialogOpen(true);
  };

  const handleItemToggle = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.includes(itemId)
        ? prev.items.filter((id) => id !== itemId)
        : [...prev.items, itemId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      toast.error("Selecione pelo menos um item");
      return;
    }

    const newPromo: Promotion = {
      id: editingPromo?.id || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      items: formData.items,
    };

    if (editingPromo) {
      updatePromotion(editingPromo.id, newPromo);
      toast.success("Promoção atualizada com sucesso!");
    } else {
      addPromotion(newPromo);
      toast.success("Promoção adicionada com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta promoção?")) {
      removePromotion(id);
      toast.success("Promoção removida com sucesso!");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Promoção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {editingPromo ? "Editar Promoção" : "Nova Promoção"}
                </DialogTitle>
                <DialogDescription>
                  Crie uma promoção especial com itens do cardápio
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Promoção</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Combo Família"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço Promocional (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Itens Inclusos</Label>
                  <ScrollArea className="h-64 border rounded-md p-4">
                    <div className="space-y-3">
                      {menu.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.id}
                            checked={formData.items.includes(item.id)}
                            onCheckedChange={() => handleItemToggle(item.id)}
                          />
                          <label
                            htmlFor={item.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {item.name}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({item.category.replace("-", " ")})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Button type="submit" className="w-full">
                  {editingPromo ? "Atualizar" : "Criar Promoção"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gerenciar Promoções</h1>

          {promotions.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma promoção cadastrada. Clique em "Nova Promoção" para começar.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promo) => (
                <Card key={promo.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{promo.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(promo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(promo.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm space-y-1">
                      <p className="font-medium">Itens inclusos:</p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {promo.items.map((itemId) => {
                          const item = menu.find((m) => m.id === itemId);
                          return item ? <li key={itemId}>{item.name}</li> : null;
                        })}
                      </ul>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-2xl font-bold text-primary">
                        R$ {promo.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
