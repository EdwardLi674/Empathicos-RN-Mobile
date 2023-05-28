import React, {useState, useEffect} from 'react';
import {Pressable, Text, Center} from 'native-base';
import {StyleSheet, Image, useWindowDimensions} from 'react-native';

export const EmpaPlainBtn = props => {
  const {title, onBtnPress, ht, textMT} = props;

  return (
    <>
      <Pressable alignItems="center" onPress={onBtnPress}>
        <Center>
          <Image
            source={require('../assets/imgs/rectangle_btn.png')}
            style={{width: 235, height: ht, resizeMode: 'stretch'}}
          />
          <Text fontSize="lg" color="white" style={styles.btn} mt={textMT}>
            {title}
          </Text>
        </Center>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    fontFamily: 'CenturyGothic',
    textTransform: 'capitalize',
  },
});
