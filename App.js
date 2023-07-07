import React, {useEffect, useRef, useState} from 'react';
import {CartProvider} from './src/context/Cart';
import Toast from 'react-native-toast-message';
import {UserProvider} from './src/context/User';
import {Router} from './src/routes/Router';
import TrackPlayer from 'react-native-track-player';
import {WithSplashScreen} from './src/screens/Splash';
import {NativeBaseProvider, Text, Box} from 'native-base';
import {StripeProvider} from '@stripe/stripe-react-native';

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
          <StripeProvider publishableKey="pk_live_51LPYbVIF1mMHT4Wpnqm6UP2ZZrqL9XPAUmhpKWpK7l2qsfWAFi4p1fj5zDgj8dsnBFbXQyBsg3VJzgPqNHzhVMtQ00YdTrC0M8">
            <WithSplashScreen isAppReady={isAppReady}>
              <Router />
              <Toast />
            </WithSplashScreen>
          </StripeProvider>
        </NativeBaseProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
