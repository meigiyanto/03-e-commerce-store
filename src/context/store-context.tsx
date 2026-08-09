"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/data/products";
import { products as initialProducts } from "@/data/products";

export type CartItem = Product & {
  quantity: number;
};

type StoreContextValue = {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];

  cartCount: number;
  cartSubtotal: number;

  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

const CART_STORAGE_KEY = "northstar-cart";
const WISHLIST_STORAGE_KEY = "northstar-wishlist";
const PRODUCTS_STORAGE_KEY = "northstar-products";

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(
        PRODUCTS_STORAGE_KEY
      );

      const savedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      const savedWishlist = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
        }
      }

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }

      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        }
      }
    } catch (error) {
      console.error(
        "Failed to restore store data:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(products)
    );
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(wishlist)
    );
  }, [wishlist, hydrated]);

  // =========================
  // PRODUCT CRUD
  // =========================

  function addProduct(product: Product) {
    setProducts((currentProducts) => [
      ...currentProducts,
      product,
    ]);
  }

  function updateProduct(product: Product) {
    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === product.id ? product : item
      )
    );

    // Keep existing cart data synchronized
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === product.id
          ? {
              ...product,
              quantity: item.quantity,
            }
          : item
      )
    );
  }

  function deleteProduct(productId: string) {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (item) => item.id !== productId
      )
    );

    // Remove deleted product from cart
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );

    // Remove deleted product from wishlist
    setWishlist((currentWishlist) =>
      currentWishlist.filter(
        (id) => id !== productId
      )
    );
  }

  // =========================
  // CART
  // =========================

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId: string) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  }

  function updateCartQuantity(
    productId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  // =========================
  // WISHLIST
  // =========================

  function toggleWishlist(productId: string) {
    setWishlist((currentWishlist) => {
      if (currentWishlist.includes(productId)) {
        return currentWishlist.filter(
          (id) => id !== productId
        );
      }

      return [...currentWishlist, productId];
    });
  }

  function isInWishlist(productId: string) {
    return wishlist.includes(productId);
  }

  // =========================
  // COMPUTED VALUES
  // =========================

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const value: StoreContextValue = {
    products,
    cart,
    wishlist,

    cartCount,
    cartSubtotal,

    addProduct,
    updateProduct,
    deleteProduct,

    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,

    toggleWishlist,
    isInWishlist,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      "useStore must be used inside StoreProvider"
    );
  }

  return context;
}