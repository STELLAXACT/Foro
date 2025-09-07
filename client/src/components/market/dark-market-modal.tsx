import { useState } from "react";
import { CartItem, DarkMarketItem, DARK_MARKET_ITEMS } from "@/lib/types";
import { storage } from "@/lib/storage";
import { useAudio } from "@/hooks/use-audio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DarkMarketModalProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdate: () => void;
}

export function DarkMarketModal({ cart, onClose, onUpdate }: DarkMarketModalProps) {
  const { toast } = useToast();
  const { playPurchaseSound } = useAudio();
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);

  const handlePurchase = async (item: DarkMarketItem) => {
    setPurchasingItem(item.id);
    
    // Play sinister sound effect
    playPurchaseSound();
    
    // Add to cart
    const cartItem: CartItem = {
      itemId: item.id,
      quantity: 1,
    };
    
    storage.addToCart(cartItem);
    onUpdate();
    
    // Show cursed purchase message
    const cursedMessages = [
      "The darkness has accepted your offering...",
      "Your soul grows heavier with each acquisition...",
      "The ancient powers stir at your purchase...",
      "Another step deeper into the abyss...",
      "The cursed item whispers your name...",
    ];
    
    const randomMessage = cursedMessages[Math.floor(Math.random() * cursedMessages.length)];
    
    toast({
      title: "🔥 Soul Transaction Complete",
      description: randomMessage,
      className: "border-accent bg-card text-foreground",
    });
    
    // Reset purchase state after animation
    setTimeout(() => {
      setPurchasingItem(null);
    }, 2000);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      const item = DARK_MARKET_ITEMS.find(i => i.id === cartItem.itemId);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-backdrop" data-testid="dark-market-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-creepy text-accent">
            <i className="fas fa-store mr-2"></i>Dark Market
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Market Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DARK_MARKET_ITEMS.map((item) => (
              <Card key={item.id} className="border-primary/30 hover:border-accent/50 transition-all" data-testid={`market-item-${item.id}`}>
                <CardHeader>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    data-testid={`item-image-${item.id}`}
                  />
                  <CardTitle className="text-lg text-accent" data-testid={`item-name-${item.id}`}>
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3" data-testid={`item-description-${item.id}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-accent font-bold" data-testid={`item-price-${item.id}`}>
                      {item.price} Soul Tokens
                    </Badge>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={purchasingItem === item.id}
                      className={`glitch transition-all ${
                        purchasingItem === item.id
                          ? "bg-destructive hover:bg-destructive/80 animate-pulse-red"
                          : "bg-accent hover:bg-accent/80"
                      } text-accent-foreground`}
                      data-testid={`button-purchase-${item.id}`}
                    >
                      <i className={`mr-2 ${
                        purchasingItem === item.id ? "fas fa-skull" : "fas fa-shopping-cart"
                      }`}></i>
                      {purchasingItem === item.id ? "Acquired!" : "Acquire"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shopping Cart */}
          <Card className="border-accent/50">
            <CardHeader>
              <CardTitle className="text-lg font-creepy text-accent">
                <i className="fas fa-shopping-cart mr-2"></i>Soul Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-ghost text-4xl text-muted-foreground mb-3"></i>
                  <p className="text-muted-foreground">Your collection is empty... for now.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-muted-foreground">
                      Items in your collection: <span className="text-accent font-semibold" data-testid="cart-count">{getCartItemsCount()}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Total Soul Tokens: <span className="text-accent font-bold" data-testid="cart-total">{getTotalPrice()}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {cart.map((cartItem) => {
                      const item = DARK_MARKET_ITEMS.find(i => i.id === cartItem.itemId);
                      if (!item) return null;
                      
                      return (
                        <div key={cartItem.itemId} className="flex items-center justify-between text-sm bg-muted rounded p-2" data-testid={`cart-item-${cartItem.itemId}`}>
                          <div className="flex items-center space-x-2">
                            <span>{item.icon}</span>
                            <span data-testid={`cart-item-name-${cartItem.itemId}`}>{item.name}</span>
                            {cartItem.quantity > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                x{cartItem.quantity}
                              </Badge>
                            )}
                          </div>
                          <span className="text-accent" data-testid={`cart-item-price-${cartItem.itemId}`}>
                            {item.price * cartItem.quantity} Tokens
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-primary/30">
                    <Button
                      onClick={() => {
                        storage.clearCart();
                        onUpdate();
                        toast({
                          title: "🔥 Collection Cleansed",
                          description: "Your cursed items have been returned to the void.",
                        });
                      }}
                      variant="destructive"
                      className="w-full"
                      data-testid="button-clear-cart"
                    >
                      <i className="fas fa-trash mr-2"></i>Banish All Items
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
