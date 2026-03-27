import { Link, useLocation } from "wouter";
import { useCartStore } from "@/hooks/use-cart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCheckoutCart } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingCart, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const checkoutMutation = useCheckoutCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const result = await checkoutMutation.mutateAsync({});
      if (result?.success) {
        toast({
          title: "Order placed successfully!",
          description: result.orderId ? `Order #${result.orderId} has been created.` : "Your order has been processed.",
        });
        clearCart();
        setLocation("/billing/orders");
      }
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error?.message || "Unable to complete checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <DashboardLayout title="Shopping Cart">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Browse our catalog and add services to your cart.
          </p>
          <Link href="/order">
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/10">
              Browse Services <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Shopping Cart">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Cart Items ({items.length})</h2>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-card border border-border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    <p className="text-sm font-semibold text-primary mt-2">
                      {item.price} {item.cycle}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="font-bold">
                    ${(parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-emerald-500">-$0.00</span>
              </div>
            </div>

            <div className="border-t border-border my-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl gap-2 shadow-lg shadow-primary/20"
              onClick={handleCheckout}
              disabled={isCheckingOut || checkoutMutation.isPending}
            >
              {isCheckingOut || checkoutMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By completing this purchase you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
