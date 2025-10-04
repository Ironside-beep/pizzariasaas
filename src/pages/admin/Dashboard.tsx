import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Store,
  MenuSquare,
  Sparkles,
  LogOut,
  ArrowLeft,
  Settings,
  Shield,
} from "lucide-react";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!isAuthenticated) return null;

  const menuItems = [
    {
      title: "Informações da Loja",
      description: "Nome, contatos, horários e localização",
      icon: Store,
      link: "/admin/store-info",
    },
    {
      title: "Gerenciar Cardápio",
      description: "Adicionar, editar e remover itens",
      icon: MenuSquare,
      link: "/admin/menu",
    },
    {
      title: "Gerenciar Promoções",
      description: "Criar e editar promoções especiais",
      icon: Sparkles,
      link: "/admin/promotions",
    },
    {
      title: "Segurança",
      description: "Alterar senha de acesso",
      icon: Shield,
      link: "/admin/security",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Site
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Painel Administrativo
            </h1>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Painel</h2>
            <p className="text-muted-foreground">
              Gerencie todas as configurações da sua pizzaria
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <Link key={item.link} to={item.link}>
                <Card className="p-6 space-y-4 hover:shadow-warm transition-all hover:scale-105 cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
