import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  useGetCart,
  useClearCart,
  useRemoveCartItem,
  useCheckoutCart,
  useGetPayMethods,
} from "@workspace/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, ArrowRight, CheckCircle2, AlertCircle,
  Loader2, CreditCard, ChevronLeft, Package, ShoppingBag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CheckoutStep = "review" | "payment" | "confirm";

function formatPrice(val: unknown): string {
  const n = typeof val === "number" ? val : parseFloat(String(val ?? "0"));
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

function CartItemRow({
  item,
  onRemove,
  removing,
}: {
  item: { id: string; name: string; billingCycle?: string; price: number; quantity?: number };
  onRemove: () => void;
  removing: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-4 p-5 border-b border-white/5 last:border-0"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{item.name}</p>
        <p className="text-muted-foreground text-sm capitalize">{item.billingCycle}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white font-mono font-bold">${formatPrice(item.price)}</p>
        {(item.quantity ?? 1) > 1 && (
          <p className="text-muted-foreground text-xs">×{item.quantity}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 shrink-0"
        onClick={onRemove}
        disabled={removing}
      >
        {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
}

export function Cart() {
  const [step, setStep] = useState<CheckoutStep>("review");
  const [selectedPayMethod, setSelectedPayMethod] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: cart, isLoading, isError, refetch } = useGetCart();
  const { data: payMethods = [] } = useGetPayMethods();
  const clearCartMut = useClearCart();
  const removeItemMut = useRemoveCartItem();
  const checkoutMut = useCheckoutCart();

  const items = cart?.items ?? [];
  const hasItems = items.length > 0;

  async function handleRemoveItem(itemId: string) {
    setRemovingId(itemId);
    try {
      await removeItemMut.mutateAsync({ itemId });
      refetch();
    } catch {
      toast({ title: "Failed to remove item", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  }

  async function handleClearCart() {
    if (!confirm("Clear your entire cart?")) return;
    try {
      await clearCartMut.mutateAsync();
      refetch();
      toast({ title: "Cart cleared" });
    } catch {
      toast({ title: "Failed to clear cart", variant: "destructive" });
    }
  }

  function handleProceedToPayment() {
    if (!hasItems) return;
    if (payMethods.length > 0 && !selectedPayMethod) {
      setSelectedPayMethod(payMethods[0].gateway);
    }
    setStep("payment");
  }

  function handleCheckout() {
    const paymentMethod = selectedPayMethod || payMethods[0]?.gateway || "paypal";
    checkoutMut.mutate(
      { data: { paymentMethod } },
      {
        onSuccess: (result) => {
          setStep("confirm");
          toast({
            title: "Order placed!",
            description: `Order #${result.orderId} created successfully.`,
          });
        },
        onError: () => {
          toast({ title: "Checkout failed", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title="My Cart">
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="My Cart">
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-muted-foreground">Failed to load cart.</p>
          <Button variant="secondary" onClick={() => refetch()}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (step === "confirm") {
    return (
      <DashboardLayout title="Order Confirmed">
        <div className="max-w-lg mx-auto text-center py-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3">Order Placed!</h2>
          <p className="text-muted-foreground mb-8">
            Your order has been submitted. You can view it in your order history.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/billing/orders")} className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              View Orders
            </Button>
            <Button variant="secondary" onClick={() => navigate("/order")}>
              Order More
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Cart">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <button
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full transition-colors ${step === "review" ? "bg-primary text-white" : "text-muted-foreground"}`}
            onClick={() => step === "payment" && setStep("review")}
          >
            <ShoppingCart className="w-4 h-4" />
            Review
          </button>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${step === "payment" ? "bg-primary text-white" : "text-muted-foreground"}`}>
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment
            </span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {!hasItems ? (
                <div className="glass p-16 rounded-2xl text-center">
                  <ShoppingCart className="w-14 h-14 text-white/20 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6">Your cart is empty.</p>
                  <Button onClick={() => navigate("/order")} className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Browse Services
                  </Button>
                </div>
              ) : (
                <>
                  <div className="glass rounded-2xl overflow-hidden mb-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          onRemove={() => handleRemoveItem(item.id)}
                          removing={removingId === item.id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="glass p-5 rounded-2xl mb-6">
                    <div className="flex justify-between text-muted-foreground text-sm mb-2">
                      <span>Subtotal</span>
                      <span className="font-mono">${formatPrice(cart?.subtotal)}</span>
                    </div>
                    {(cart?.tax ?? 0) > 0 && (
                      <div className="flex justify-between text-muted-foreground text-sm mb-2">
                        <span>Tax</span>
                        <span className="font-mono">${formatPrice(cart?.tax)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="font-mono">${formatPrice(cart?.total)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
                      onClick={handleClearCart}
                      disabled={clearCartMut.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cart
                    </Button>
                    <Button onClick={handleProceedToPayment} className="gap-2">
                      Continue to Payment
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button
                onClick={() => setStep("review")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Cart
              </button>

              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground truncate mr-4">{item.name}</span>
                    <span className="text-white font-mono shrink-0">${formatPrice(item.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-white/10 mt-3">
                  <span>Total</span>
                  <span className="font-mono">${formatPrice(cart?.total)}</span>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold text-white mb-4">Payment Method</h3>
                {payMethods.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-3">No saved payment methods.</p>
                    <Link href="/account/payment-methods" className="text-primary text-sm hover:underline">
                      Add a payment method
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payMethods.map((pm) => (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedPayMethod === pm.gateway
                            ? "border-primary/60 bg-primary/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          value={pm.gateway}
                          checked={selectedPayMethod === pm.gateway}
                          onChange={() => setSelectedPayMethod(pm.gateway)}
                          className="accent-primary"
                        />
                        <CreditCard className="w-4 h-4 text-primary/60 shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium">{pm.description}</p>
                          {pm.lastFour && (
                            <p className="text-muted-foreground text-xs">•••• {pm.lastFour}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCheckout}
                  disabled={checkoutMut.isPending}
                  className="gap-2 font-bold"
                  size="lg"
                >
                  {checkoutMut.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {checkoutMut.isPending ? "Processing…" : "Place Order"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
