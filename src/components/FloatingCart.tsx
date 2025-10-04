import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, Send, Pizza } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export const FloatingCart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { storeInfo } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [observations, setObservations] = useState("");
  const [isDelivery, setIsDelivery] = useState(true);

  const handleFinishOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Por favor, preencha seu nome e telefone");
      return;
    }

    if (isDelivery && !customerAddress.trim()) {
      toast.error("Por favor, preencha o endereço para entrega");
      return;
    }

    let message = `🍕 *Novo Pedido!*\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📱 *Telefone:* ${customerPhone}\n`;
    
    if (isDelivery) {
      message += `📍 *Endereço:* ${customerAddress}\n`;
    } else {
      message += `🏪 *Retirada no local*\n`;
    }
    
    message += `💳 *Pagamento:* ${paymentMethod}\n\n`;
    message += `📋 *Itens do Pedido:*\n`;

    items.forEach((item) => {
      message += `\n• ${item.quantity}x ${item.name}`;
      if (item.size) {
        message += ` (${item.size})`;
      }
      message += ` - R$ ${(item.price * item.quantity).toFixed(2)}`;
      if (item.observations) {
        message += `\n  _Obs: ${item.observations}_`;
      }
    });

    message += `\n\n💰 *Total: R$ ${total.toFixed(2)}*`;
    
    if (observations.trim()) {
      message += `\n\n📝 *Observações:* ${observations}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${storeInfo.whatsapp.replace(/\D/g, "")}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    
    clearCart();
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");
    setObservations("");
    setIsOpen(false);
    
    toast.success("Pedido enviado! Aguarde o retorno pelo WhatsApp");
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-16 w-16 md:h-18 md:w-18 rounded-full shadow-xl z-[999] hover:scale-110 active:scale-95 transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/70 border-4 border-secondary/20 flex items-center justify-center group touch-manipulation"
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <div className="relative flex items-center justify-center">
            <Pizza className="h-7 w-7 md:h-8 md:w-8 group-hover:rotate-12 transition-transform duration-300 text-primary-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full min-w-[26px] h-6 px-2 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-background">
                {itemCount}
              </span>
            )}
          </div>
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Meu Carrinho 🍕</SheetTitle>
          <SheetDescription>
            Revise seu pedido e finalize
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.size && (
                        <p className="text-sm text-muted-foreground capitalize">{item.size}</p>
                      )}
                      <p className="text-sm font-medium text-primary mt-1">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeItem(item.id, item.size)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total:</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <Label>Tipo de Pedido</Label>
                    <RadioGroup value={isDelivery ? "delivery" : "pickup"} onValueChange={(v) => setIsDelivery(v === "delivery")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="font-normal cursor-pointer">Entrega</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="font-normal cursor-pointer">Retirar no local</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {isDelivery && (
                    <div>
                      <Label htmlFor="address">Endereço *</Label>
                      <Textarea
                        id="address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Rua, número, bairro, complemento..."
                        rows={3}
                      />
                    </div>
                  )}

                  <div>
                    <Label>Forma de Pagamento</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dinheiro" id="dinheiro" />
                        <Label htmlFor="dinheiro" className="font-normal cursor-pointer">Dinheiro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debito" id="debito" />
                        <Label htmlFor="debito" className="font-normal cursor-pointer">Débito</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credito" id="credito" />
                        <Label htmlFor="credito" className="font-normal cursor-pointer">Crédito</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="font-normal cursor-pointer">Pix</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="obs">Observações</Label>
                    <Textarea
                      id="obs"
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Alguma observação sobre o pedido?"
                      rows={2}
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full shadow-warm"
                    onClick={handleFinishOrder}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
