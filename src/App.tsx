import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { StoreProvider } from "./contexts/StoreContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Promotions from "./pages/Promotions";
import AuthLogin from "./pages/auth/Login";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import StoreInfo from "./pages/admin/StoreInfo";
import MenuManagement from "./pages/admin/MenuManagement";
import PromotionManagement from "./pages/admin/PromotionManagement";
import Security from "./pages/admin/Security";
import NotFound from "./pages/NotFound";

// 🔹 Importamos a nova página pública com base no slug
import StorePublic from "./pages/StorePublic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Index />} />
                <Route path="/cardapio" element={<Menu />} />
                <Route path="/promocoes" element={<Promotions />} />

                {/* Autenticação */}
                <Route path="/auth/login" element={<AuthLogin />} />

                {/* Painel administrativo */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/store-info" element={<StoreInfo />} />
                <Route path="/admin/menu" element={<MenuManagement />} />
                <Route path="/admin/promotions" element={<PromotionManagement />} />
                <Route path="/admin/security" element={<Security />} />

                {/* 🔹 Nova rota dinâmica para exibir a pizzaria pelo slug */}
                <Route path="/:slug" element={<StorePublic />} />

                {/* Página 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
