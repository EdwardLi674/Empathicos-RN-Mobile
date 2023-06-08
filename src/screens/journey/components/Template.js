import React from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {Center, View, Text, ScrollView} from 'native-base';

export const Template = props => {
  const {image, title, description} = props;
  const {height, width} = useWindowDimensions();

  return (
    <ScrollView style={{height: height * 0.5}} mt={height * 0.07} zIndex="1">
      <Center>
        <View>
          <Image
            source={require('../../../assets/imgs/frame_path4.png')}
            style={{
              width: width * 0.55,
              height: width * 0.45,
              borderRadius: 30,
            }}
          />
          <Image
            source={{uri: image}}
            style={{
              width: width * 0.45,
              height: width * 0.35,
              position: 'absolute',
              top: 20,
              left: 20,
              borderRadius: 10,
            }}
          />
          <Image
            source={require('../../../assets/imgs/image_frame1.png')}
            style={{
              width: width * 0.54,
              height: width * 0.45,
              position: 'absolute',
              top: 5,
              left: 5,
              borderRadius: 10,
            }}
          />
        </View>
        <View style={{width: width}}>
          <Text
            color="white"
            fontFamily="CenturyGothic"
            fontSize="21"
            px="8"
            pt="4">
            {title}
          </Text>
          <Text color="white" fontFamily="CenturyGothic" fontSize="17" px="8">
            {description}
          </Text>
        </View>
      </Center>
    </ScrollView>
  );
};
