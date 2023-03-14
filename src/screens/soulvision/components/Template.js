import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {Center, View, ScrollView} from 'native-base';
import RenderHtml from 'react-native-render-html';

export const Template = props => {
  const {image, description} = props;
  const {height, width} = useWindowDimensions();

  // const [isPlaying, setPlaying] = useState('none');

  // useEffect(() => {
  // setPlaying('none');
  // setSliderMaxValue(duration);
  // }, [selectedIdx]);

  return (
    <View mt="8" zIndex="1">
      <Center>
        <View>
          <Image
            source={{uri: image}}
            style={{
              width: width * 0.8,
              height: height * 0.25,
              borderRadius: 10,
              borderColor: 'white',
              borderWidth: 4,
            }}
          />
        </View>
        <View style={{width: width}} mt="3">
          <ScrollView
            bg="primary.100"
            mx="10"
            px="3"
            py="1"
            borderRadius="6"
            fontFamily="CenturyGothic"
            style={{height: height * 0.2}}>
            <RenderHtml contentWidth={width} source={{html: description}} />
          </ScrollView>
        </View>
      </Center>
    </View>
  );
};
