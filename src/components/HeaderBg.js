import React, {useState} from 'react';
import {StyleSheet, View, Image, useWindowDimensions} from 'react-native';

export const HeaderBg = props => {
  const {height, width} = useWindowDimensions();
  const {num} = props;

  let headerImage = (
    <Image
      source={require('../assets/imgs/header_bg.png')}
      style={[styles.headerBg(width, height)]}
    />
  );

  if (num) {
    const remainder = parseInt(num) % 6;
    switch (remainder) {
      case 0:
        headerImage = (
          <Image
            source={require('../assets/imgs/new_header_1.png')}
            style={[styles.headerBg(width, height)]}
          />
        );
        break;
      case 1:
        headerImage = (
          <Image
            source={require('../assets/imgs/new_header_2.png')}
            style={[styles.headerBg(width, height)]}
          />
        );
        break;
      case 2:
        headerImage = (
          <Image
            source={require('../assets/imgs/new_header_3.png')}
            style={[styles.headerBg(width, height)]}
          />
        );
        break;
      case 3:
        headerImage = (
          <Image
            source={require('../assets/imgs/new_header_4.png')}
            style={[styles.headerBg(width, height)]}
          />
        );
        break;
      case 4:
        headerImage = (
          <Image
            source={require('../assets/imgs/new_header_5.png')}
            style={[styles.headerBg(width, height)]}
          />
        );
        break;
      case 5:
        headerImage = (
          <Image
            source={require('../assets/imgs/new_header_6.png')}
            style={[styles.headerBg(width, height)]}
          />
        );
        break;
    }
  }

  return <>{headerImage}</>;
};

const styles = StyleSheet.create({
  headerBg: (width, height) => ({
    position: 'absolute',
    height: Math.round(height * 0.21),
    width: width,
    top: -10,
  }),
});
