import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, ImageBackground} from 'react-native';
import {Header} from './Header';
import {Footer} from './Footer';

export const Layout = props => {
  let BackgroundImages = [
    require('../assets/imgs/image_bgstars.png'),
    require('../assets/imgs/bgheart1.png'),
    require('../assets/imgs/bgheart2.png'),
    require('../assets/imgs/bgheart3.png'),
    require('../assets/imgs/bgheart4.png'),
    require('../assets/imgs/bgheart5.png'),
    require('../assets/imgs/bgnight.png'),
  ];

  let bg = BackgroundImages[0];
  if (props?.bgIdx === '1') {
    bg = BackgroundImages[1];
  } else if (props?.bgIdx === '2') {
    bg = BackgroundImages[2];
  } else if (props?.bgIdx === '3') {
    bg = BackgroundImages[3];
  } else if (props?.bgIdx === '4') {
    bg = BackgroundImages[4];
  } else if (props?.bgIdx === '5') {
    bg = BackgroundImages[5];
  } else if (props?.bgIdx === '6') {
    bg = BackgroundImages[6];
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
        <Header screenInfo={props.screenInfo} />
        {props.children}
        {!props?.hideFooter && <Footer type={props.screenInfo.footer} />}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#24b5d5',
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
