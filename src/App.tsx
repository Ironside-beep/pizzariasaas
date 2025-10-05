import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { StoreProvider } from "./contexts/StoreContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Promotions from "./pages/Promotions";
import AuthLogin from "./pages/auth/Login";
import AuthRegister from "./pages/auth/Register";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import StoreInfo from "./pages/admin/StoreInfo";
import MenuManagement from "./pages/admin/MenuManagement";
import PromotionManagement from "./pages/admin/PromotionManagement";
import Security from "./pages/admin/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas do admin
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const key = params.get("key");

  // Token simples e seguro
  if (key !== "IronsideAdm123") {
    return <Navigate to="/notfound" replace />;
  }

  return children;
};

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
                <Route path="/auth/login" element={<AuthLogin />} />
                <Route path="/auth/register" element={<AuthRegister />} />

                {/* Rotas admin protegidas */}
                <Route
                  path="/admin/login"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLogin />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/store-info"
                  element={
                    <ProtectedAdminRoute>
                      <StoreInfo />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/menu"
                  element={
                    <ProtectedAdminRoute>
                      <MenuManagement />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/promotions"
                  element={
                    <ProtectedAdminRoute>
                      <PromotionManagement />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/security"
                  element={
                    <ProtectedAdminRoute>
                      <Security />
                    </ProtectedAdminRoute>
                  }
                />

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
