import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext();

const GlobalProvider = ({children}) => {
  const [globalData, setGlobalData] = useState();

  useEffect(() => {
    //Every time the App is opened, this provider is rendered and call de loadStorage function.
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      //Try get the data from Async Storage
      const globalDataSerialized = await AsyncStorage.getItem('@GlobalData');
      let _globalData = null;
      if (globalDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        _globalData = JSON.parse(globalDataSerialized);
        setGlobalData(_globalData);
      }
    } catch (error) {
      console.log('Get async storage error: ', error);
    }
  };

  const onScreen = async _screenData => {
    try {
      setGlobalData(_screenData);
      await AsyncStorage.setItem('@GlobalData', JSON.stringify(_screenData));
    } catch (error) {
      console.log('Set async storage error: ', error);
    }
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <GlobalContext.Provider value={{globalData, onScreen}}>
      {children}
    </GlobalContext.Provider>
  );
};

//A simple hooks to facilitate the access to the LangContext
// and permit components to subscribe to LangContext updates
const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobal must be used within an GlobalProvider');
  }

  return context;
};

export {GlobalContext, GlobalProvider, useGlobal};
