"use client";

import { createContext, ReactNode, useState } from "react";

type CartContextType = {
  numberOfCartItems: number;
  setNumberOfCartItems: (value: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
  setCartFromServer: (count: number) => void;
};

export const CartContext = createContext<CartContextType>({
  numberOfCartItems: 0,
  setNumberOfCartItems: () => {},
  incrementCart: () => {},
  decrementCart: () => {},
  setCartFromServer: () => {},
});

export default function CartContextProvider({
  children,
  initialCount = 0,
}: {
  children: ReactNode;
  initialCount?: number;
}) {
  const [numberOfCartItems, setNumberOfCartItems] = useState(initialCount);

  function incrementCart() {
    setNumberOfCartItems((prev) => prev + 1);
  }

  function decrementCart() {
    setNumberOfCartItems((prev) => Math.max(prev - 1, 0));
  }

  function setCartFromServer(count: number) {
    setNumberOfCartItems(count);
  }
  // function updateNumberOfCartItems(num: number) {
  //       setNumberOfCartItems(num);
  //   }

  return (
    <CartContext.Provider
      value={{
        numberOfCartItems,
        setNumberOfCartItems,
        incrementCart,
        decrementCart,
        setCartFromServer,
        // updateNumberOfCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}