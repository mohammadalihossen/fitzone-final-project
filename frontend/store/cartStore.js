import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(i => i._id === product._id);
        if (existing) {
          set({
            items: items.map(i =>
              i._id === product._id
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i._id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(i =>
            i._id === productId ? { ...i, quantity } : i
          )
        });
      },

      clearCart: () => set({ items: [] }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, i) => {
          const price = i.discountPrice || i.price;
          return sum + price * i.quantity;
        }, 0);
      },

      get shippingCost() {
        return get().subtotal >= 5000 ? 0 : 120;
      },

      get total() {
        return get().subtotal + get().shippingCost;
      },
    }),
    {
      name: 'fitzone-cart',
    }
  )
);

export default useCartStore;
