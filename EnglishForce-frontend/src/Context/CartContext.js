import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [])

  const setCart = (items) => {
    setCartItems(items) ;
  }

  const addToCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.public_id === item.public_id);

    if (!isItemInCart) {
      setCartItems([...cartItems, item]);
    } 
  };

  const removeFromCart = (item) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.public_id !== item.public_id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price?parseFloat(item.price):0), 0);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems)); 
  }, [cartItems]);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};