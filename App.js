import React, {useEffect, useRef, useState} from 'react';
import {CartProvider} from './src/context/Cart';
import Toast from 'react-native-toast-message';
import {UserProvider} from './src/context/User';
import {Router} from './src/routes/Router';
import TrackPlayer from 'react-native-track-player';
import {WithSplashScreen} from './src/screens/Splash';
import {NativeBaseProvider, Text, Box} from 'native-base';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  const setUpTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setUpTrackPlayer();
    setIsAppReady(true);
  }, []);

  return (
    <UserProvider>
      <CartProvider>
        <NativeBaseProvider>
          <WithSplashScreen isAppReady={isAppReady}>
            <Router />
            <Toast />
          </WithSplashScreen>
        </NativeBaseProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
