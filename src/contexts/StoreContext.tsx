import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface MenuItem {
  id: string;
  name: string;
  category: "pizza-salgada" | "pizza-doce" | "esfirra-salgada" | "esfirra-doce" | "bebidas";
  priceBroto?: number;
  priceGrande?: number;
  price?: number;
  observations?: string;
}

export interface Promotion {
  id: string;
  name: string;
  price: number;
  items: string[];
}

// Estrutura preparada para migração futura ao banco de dados
interface StoreInfo {
  name: string;
  whatsapp: string;
  instagram: string;
  location: string;
  hours: { id: string; day: string; time: string }[]; // Array de horários com ID único
  deliveryTime: string;
  openingTime?: string; // Formato HH:mm (ex: "18:00")
  closingTime?: string; // Formato HH:mm (ex: "23:00")
  operatingDays?: number[]; // Array de dias da semana (0=Domingo, 1=Segunda, etc)
}

interface StoreContextType {
  storeInfo: StoreInfo;
  menu: MenuItem[];
  promotions: Promotion[];
  updateStoreInfo: (info: Partial<StoreInfo>) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
  addPromotion: (promo: Promotion) => void;
  updatePromotion: (id: string, promo: Partial<Promotion>) => void;
  removePromotion: (id: string) => void;
}

const defaultStoreInfo: StoreInfo = {
  name: "Pizza Delivery",
  whatsapp: "5511999999999",
  instagram: "@pizzadelivery",
  location: "https://maps.google.com",
  hours: [
    { id: "1", day: "Terça a Domingo", time: "18h - 23h" }
  ],
  deliveryTime: "40-60 minutos",
  openingTime: "18:00",
  closingTime: "23:00",
  operatingDays: [0, 2, 3, 4, 5, 6], // Terça a Domingo (0=Dom, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb)
};

const defaultMenu: MenuItem[] = [
  {
    id: "1",
    name: "Mussarela",
    category: "pizza-salgada",
    priceBroto: 25,
    priceGrande: 40,
    observations: "Queijo mussarela e molho de tomate",
  },
  {
    id: "2",
    name: "Calabresa",
    category: "pizza-salgada",
    priceBroto: 28,
    priceGrande: 45,
    observations: "Calabresa, cebola e azeitonas",
  },
  {
    id: "3",
    name: "Chocolate",
    category: "pizza-doce",
    priceBroto: 30,
    priceGrande: 48,
    observations: "Chocolate ao leite derretido",
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    const saved = localStorage.getItem("storeInfo");
    return saved ? JSON.parse(saved) : defaultStoreInfo;
  });

  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("menu");
    return saved ? JSON.parse(saved) : defaultMenu;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem("promotions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("storeInfo", JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem("promotions", JSON.stringify(promotions));
  }, [promotions]);

  const updateStoreInfo = (info: Partial<StoreInfo>) => {
    setStoreInfo((prev) => ({ ...prev, ...info }));
  };

  const addMenuItem = (item: MenuItem) => {
    setMenu((prev) => [...prev, item]);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, ...item } : m)));
  };

  const removeMenuItem = (id: string) => {
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };

  const addPromotion = (promo: Promotion) => {
    setPromotions((prev) => [...prev, promo]);
  };

  const updatePromotion = (id: string, promo: Partial<Promotion>) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, ...promo } : p)));
  };

  const removePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        storeInfo,
        menu,
        promotions,
        updateStoreInfo,
        addMenuItem,
        updateMenuItem,
        removeMenuItem,
        addPromotion,
        updatePromotion,
        removePromotion,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

export const useIsStoreOpen = () => {
  const { storeInfo } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIfOpen = () => {
      if (!storeInfo.openingTime || !storeInfo.closingTime || !storeInfo.operatingDays) {
        return false;
      }

      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Verifica se hoje é dia de funcionamento
      const isOperatingDay = storeInfo.operatingDays.includes(currentDay);
      
      // Verifica se está dentro do horário
      const isWithinHours = currentTime >= storeInfo.openingTime && currentTime <= storeInfo.closingTime;

      return isOperatingDay && isWithinHours;
    };

    setIsOpen(checkIfOpen());
    
    // Atualiza a cada minuto
    const interval = setInterval(() => {
      setIsOpen(checkIfOpen());
    }, 60000);

    return () => clearInterval(interval);
  }, [storeInfo.openingTime, storeInfo.closingTime, storeInfo.operatingDays]);

  return isOpen;
};
