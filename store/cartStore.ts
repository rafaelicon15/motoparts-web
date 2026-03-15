// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  priceUSD: number;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      // Función para añadir productos
      addToCart: (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === item.id);
        
        if (existingItem) {
          // Si ya existe, le sumamos 1 a la cantidad
          set({
            cart: currentCart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          // Si es nuevo, lo agregamos con cantidad 1
          set({ cart: [...currentCart, { ...item, quantity: 1 }] });
        }
      },
      // Función para eliminar un producto
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i.id !== id) });
      },
      // Función para vaciar el carrito
      clearCart: () => set({ cart: [] }),
      // Función para contar cuántos items hay en total
      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'motoparts-cart', // Este es el nombre con el que se guardará en el LocalStorage
    }
  )
);