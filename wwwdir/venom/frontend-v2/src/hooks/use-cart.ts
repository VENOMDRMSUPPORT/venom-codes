import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: string;
  cycle: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  get total(): number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
        ),
      }));
    } else {
      set((state) => ({
        items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
      }));
    }
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  get total() {
    return get().items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + price * item.quantity;
    }, 0);
  },
}));
