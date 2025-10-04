import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import { useIsStoreOpen } from "@/contexts/StoreContext";
import { Badge } from "./ui/badge";

export const Header = () => {
  const isOpen = useIsStoreOpen();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🍕 Pizza Delivery
          </Link>
          <Badge 
            variant={isOpen ? "default" : "destructive"}
            className={isOpen ? "bg-accent hover:bg-accent/90" : ""}
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-accent-foreground' : 'bg-destructive-foreground'} animate-pulse`} />
              {isOpen ? "Aberto" : "Fechado"}
            </span>
          </Badge>
        </div>
        
        <Link to="/admin/login">
          <Button variant="outline" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
};
