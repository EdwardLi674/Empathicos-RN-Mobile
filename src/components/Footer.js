import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {StyleSheet, View, Image, useWindowDimensions} from 'react-native';
import {Pressable, HStack} from 'native-base';

export const Footer = props => {
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();

  let footerEle = (
    <Image
      source={require('../assets/imgs/footer_home_bg.png')}
      style={[styles.footerBg(width, height, 0.33)]}
    />
  );

  if (props.type === '1') {
    footerEle = (
      <>
        <Image
          source={require('../assets/imgs/footer_bg.png')}
          style={[styles.footerBg(width, height, 0.28)]}
        />
        <HStack
          space="3"
          alignItems="center"
          justifyContent="space-between"
          px="2"
          pb="2">
          <Pressable onPress={() => navigation.navigate('visit_shop')}>
            <Image
              source={require('../assets/imgs/visit_shop.png')}
              style={{width: width * 0.35, height: height * 0.15}}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('ask_ana')}>
            <Image
              source={require('../assets/imgs/ask_ana.png')}
              style={{width: width * 0.35, height: height * 0.15}}
            />
          </Pressable>
        </HStack>
      </>
    );
  } else if (props.type === '2') {
    footerEle = (
      <Image
        source={require('../assets/imgs/new_footer_2.png')}
        style={[styles.footerBg(width, height, 0.33)]}
      />
    );
  }
  return <View style={styles.footer}>{footerEle}</View>;
};

const styles = StyleSheet.create({
  footerBg: (width, height, per) => ({
    position: 'absolute',
    height: Math.round(height * per),
    width: width,
    bottom: -60,
  }),
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
