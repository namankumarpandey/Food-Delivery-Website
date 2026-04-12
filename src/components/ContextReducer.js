import React, { useReducer, useContext, createContext } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existingItem = state.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size,
      );

      if (existingItem) {
        // ✅ Update existing item
        return state.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? {
                ...item,
                qty: item.qty + action.payload.qty,
                price: (item.qty + action.payload.qty) * action.payload.price,
              }
            : item,
        );
      }
      // ✅ Add new item
      return [...state, action.payload];
    }

    case "REMOVE":
      return state.filter((item) => item.id !== action.payload.id);

    case "DROP":
      return [];

    case "UPDATE":
      return state.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              qty: item.qty + action.payload.qty,
              price: item.price + action.payload.price,
            }
          : item,
      );

    default:
      return state;
  }
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

// Hooks
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
