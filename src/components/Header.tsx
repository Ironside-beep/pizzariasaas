import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";

export const Header = () => {
  // Controle de visibilidade do botão admin
  const showAdminButton = false; // false = oculto, true = visível

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            🍕 IPIZZA
          </Link>
          {/* Badge "Aberto/Fechado" removido do Header */}
        </div>

        {/* Botão Admin só aparece se showAdminButton for true */}
        {showAdminButton && (
          <Link to="/admin/login">
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};
