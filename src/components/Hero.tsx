import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MapPin, Instagram, MenuSquare, Sparkles } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { storeInfo } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const openLocation = () => {
    window.open(storeInfo.location, "_blank");
  };

  const openInstagram = () => {
    window.open(`https://instagram.com/${storeInfo.instagram.replace("@", "")}`, "_blank");
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjZiMzUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
      
      <div
        className={`text-center space-y-8 transition-all duration-1000 transform relative z-10 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Entrega rápida e saborosa</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            Bem-vindo à
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
            {storeInfo.name}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            As melhores pizzas da região! Sabor autêntico, ingredientes frescos e entrega rápida.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/cardapio">
            <Button size="lg" className="shadow-warm">
              <MenuSquare className="mr-2 h-5 w-5" />
              Ver Cardápio
            </Button>
          </Link>
          
          <Button size="lg" variant="outline" onClick={openLocation}>
            <MapPin className="mr-2 h-5 w-5" />
            Como Chegar
          </Button>
          
          <Button size="lg" variant="outline" onClick={openInstagram}>
            <Instagram className="mr-2 h-5 w-5" />
            Instagram
          </Button>

          <Link to="/promocoes">
            <Button size="lg" variant="secondary">
              <Sparkles className="mr-2 h-5 w-5" />
              Promoções
            </Button>
          </Link>
        </div>

        <div className="pt-8 space-y-2 text-muted-foreground">
          <div className="space-y-1">
            <p className="font-semibold">Horários:</p>
            {storeInfo.hours.map((hour) => (
              <p key={hour.id} className="text-sm">
                {hour.day}: {hour.time}
              </p>
            ))}
          </div>
          <p className="flex items-center justify-center gap-2 pt-2">
            <span className="font-semibold">Entrega:</span> {storeInfo.deliveryTime}
          </p>
        </div>
      </div>
    </section>
  );
};
