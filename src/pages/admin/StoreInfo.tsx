import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function StoreInfo() {
  const { isAuthenticated } = useAuth();
  const { storeInfo, updateStoreInfo } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(storeInfo);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreInfo(formData);
    toast.success("Informações atualizadas com sucesso!");
  };

  const addHour = () => {
    setFormData({
      ...formData,
      hours: [
        ...formData.hours,
        { id: Date.now().toString(), day: "", time: "" }
      ]
    });
  };

  const removeHour = (id: string) => {
    setFormData({
      ...formData,
      hours: formData.hours.filter(h => h.id !== id)
    });
  };

  const updateHour = (id: string, field: 'day' | 'time', value: string) => {
    setFormData({
      ...formData,
      hours: formData.hours.map(h => 
        h.id === id ? { ...h, [field]: value } : h
      )
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Informações da Loja</h1>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Pizzaria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="5511999999999"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@suapizzaria"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Link do Google Maps</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Horários de Funcionamento</Label>
                  <Button type="button" onClick={addHour} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Horário
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.hours.map((hour) => (
                    <Card key={hour.id} className="p-4">
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label htmlFor={`day-${hour.id}`}>Dias</Label>
                            <Input
                              id={`day-${hour.id}`}
                              value={hour.day}
                              onChange={(e) => updateHour(hour.id, 'day', e.target.value)}
                              placeholder="Ex: Segunda a Sexta"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`time-${hour.id}`}>Horário</Label>
                            <Input
                              id={`time-${hour.id}`}
                              value={hour.time}
                              onChange={(e) => updateHour(hour.id, 'time', e.target.value)}
                              placeholder="Ex: 18h - 23h"
                              required
                            />
                          </div>
                        </div>
                        {formData.hours.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHour(hour.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Tempo de Entrega</Label>
                <Input
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="40-60 minutos"
                  required
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Configuração de Aberto/Fechado</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Horário de Abertura</Label>
                    <Input
                      id="openingTime"
                      type="time"
                      value={formData.openingTime || "18:00"}
                      onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Horário de Fechamento</Label>
                    <Input
                      id="closingTime"
                      type="time"
                      value={formData.closingTime || "23:00"}
                      onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dias de Funcionamento</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 0, label: "Dom" },
                      { value: 1, label: "Seg" },
                      { value: 2, label: "Ter" },
                      { value: 3, label: "Qua" },
                      { value: 4, label: "Qui" },
                      { value: 5, label: "Sex" },
                      { value: 6, label: "Sáb" },
                    ].map((day) => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={(formData.operatingDays || []).includes(day.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentDays = formData.operatingDays || [];
                          const newDays = currentDays.includes(day.value)
                            ? currentDays.filter(d => d !== day.value)
                            : [...currentDays, day.value].sort();
                          setFormData({ ...formData, operatingDays: newDays });
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Save className="mr-2 h-5 w-5" />
                Salvar Alterações
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
