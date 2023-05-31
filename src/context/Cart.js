import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const CartProvider = ({children}) => {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered and call de loadStorage function.
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      //Try get the data from Async Storage
      const cartDataSerialized = await AsyncStorage.getItem('@CartData');
      let _cartData = null;
      if (cartDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        _cartData = JSON.parse(cartDataSerialized);
        setCartData(_cartData);
      }
    } catch (error) {
      console.log('Get async storage error: ', error);
    }
  };

  const onCart = async _cartData => {
    try {
      setCartData(_cartData);
      await AsyncStorage.setItem('@CartData', JSON.stringify(_cartData));
    } catch (error) {
      console.log('Set async storage error: ', error);
    }
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <CartContext.Provider value={{cartData, onCart}}>
      {children}
    </CartContext.Provider>
  );
};

//A simple hooks to facilitate the access to the LangContext
// and permit components to subscribe to LangContext updates
const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within an CartProvider');
  }

  return context;
};

export {CartContext, CartProvider, useCart};
