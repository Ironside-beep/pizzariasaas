import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FloatingCart } from "@/components/FloatingCart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FloatingCart />
    </div>
  );
};

export default Index;
