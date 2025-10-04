import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStore, MenuItem } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categoryOptions = [
  { value: "pizza-salgada", label: "Pizza Salgada" },
  { value: "pizza-doce", label: "Pizza Doce" },
  { value: "esfirra-salgada", label: "Esfirra Salgada" },
  { value: "esfirra-doce", label: "Esfirra Doce" },
  { value: "bebidas", label: "Bebidas" },
];

export default function MenuManagement() {
  const { isAuthenticated } = useAuth();
  const { menu, addMenuItem, updateMenuItem, removeMenuItem } = useStore();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "pizza-salgada" as MenuItem["category"],
    priceBroto: "",
    priceGrande: "",
    price: "",
    observations: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "pizza-salgada",
      priceBroto: "",
      priceGrande: "",
      price: "",
      observations: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      priceBroto: item.priceBroto?.toString() || "",
      priceGrande: item.priceGrande?.toString() || "",
      price: item.price?.toString() || "",
      observations: item.observations || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isPizza = formData.category.includes("pizza");
    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      observations: formData.observations,
    };

    if (isPizza) {
      newItem.priceBroto = parseFloat(formData.priceBroto);
      newItem.priceGrande = parseFloat(formData.priceGrande);
    } else {
      newItem.price = parseFloat(formData.price);
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, newItem);
      toast.success("Item atualizado com sucesso!");
    } else {
      addMenuItem(newItem);
      toast.success("Item adicionado com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      removeMenuItem(id);
      toast.success("Item removido com sucesso!");
    }
  };

  if (!isAuthenticated) return null;

  const isPizza = formData.category.includes("pizza");

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
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar Item" : "Novo Item"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do item do cardápio
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem["category"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isPizza ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="priceBroto">Preço Broto (R$)</Label>
                      <Input
                        id="priceBroto"
                        type="number"
                        step="0.01"
                        value={formData.priceBroto}
                        onChange={(e) => setFormData({ ...formData, priceBroto: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priceGrande">Preço Grande (R$)</Label>
                      <Input
                        id="priceGrande"
                        type="number"
                        step="0.01"
                        value={formData.priceGrande}
                        onChange={(e) => setFormData({ ...formData, priceGrande: e.target.value })}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="observations">Descrição</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingItem ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gerenciar Cardápio</h1>

          {menu.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhum item cadastrado. Clique em "Novo Item" para começar.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menu.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.category.replace("-", " ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {item.observations && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.observations}
                    </p>
                  )}

                  <div className="text-sm space-y-1">
                    {item.priceBroto && item.priceGrande ? (
                      <>
                        <p>Broto: <span className="font-bold text-primary">R$ {item.priceBroto.toFixed(2)}</span></p>
                        <p>Grande: <span className="font-bold text-primary">R$ {item.priceGrande.toFixed(2)}</span></p>
                      </>
                    ) : (
                      <p className="font-bold text-primary text-lg">R$ {item.price?.toFixed(2)}</p>
                    )}
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
