import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Center} from 'native-base';

export function WithSplashScreen({children, isAppReady}) {
  return (
    <>
      {isAppReady && children}

      <Splash isAppReady={isAppReady} />
    </>
  );
}

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';

export const Splash = ({isAppReady}) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState(LOADING_IMAGE);

  useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000, // Fade in duration
        useNativeDriver: true,
      }).start(() => {
        setState(WAIT_FOR_APP_TO_BE_READY);
      });
    }
  }, [imageOpacity, state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setState(FADE_OUT);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000, // Fade out duration
        delay: 1000, // Minimum time the logo will stay visible
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) return null;

  return (
    <Animated.View
      collapsable={false}
      style={[style.container, {opacity: containerOpacity}]}>
      <Center>
        <Animated.Image
          source={require('../assets/imgs/icon_andreea.png')}
          fadeDuration={0}
          onLoad={() => {
            setState(FADE_IN_IMAGE);
          }}
          style={[style.image, {opacity: imageOpacity}]}
          resizeMode="contain"
        />
        <Animated.Text
          fadeDuration={0}
          onLoad={() => {
            setState(FADE_IN_IMAGE);
          }}
          style={{
            opacity: imageOpacity,
            color: 'white',
            fontFamily: 'CenturyGothic',
            fontSize: 40,
          }}>
          Empathicos
        </Animated.Text>
        <Animated.Text
          fadeDuration={0}
          onLoad={() => {
            setState(FADE_IN_IMAGE);
          }}
          style={{
            opacity: imageOpacity,
            color: 'white',
            fontFamily: 'CenturyGothic',
            fontSize: 24,
          }}>
          Discover Your Magic!
        </Animated.Text>
      </Center>
      <Center>
        <Animated.Text
          fadeDuration={0}
          onLoad={() => {
            setState(FADE_IN_IMAGE);
          }}
          style={{
            opacity: imageOpacity,
            color: 'white',
            fontFamily: 'CenturyGothic',
            fontSize: 32,
          }}>
          LET'S GO
        </Animated.Text>
      </Center>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#b24097',
    justifyContent: 'space-evenly',
  },
  image: {
    width: 200,
    height: 200,
  },
});
