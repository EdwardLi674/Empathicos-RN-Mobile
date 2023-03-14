import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {Center, View, ScrollView, HStack, Icon, Slider} from 'native-base';
import RenderHtml from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const Course = props => {
  const {
    selectedIdx,
    image,
    description,
    onPlayPause,
    onForwardBackward,
    position,
    duration,
    onPositionChange,
    status,
  } = props;
  const {height, width} = useWindowDimensions();

  // const [isPlaying, setPlaying] = useState('none');

  // useEffect(() => {
  // setPlaying('none');
  // setSliderMaxValue(duration);
  // }, [selectedIdx]);

  const onPlayPausePress = async () => {
    if (status === 'playing') {
      onPlayPause('none');
    } else {
      onPlayPause('play');
    }
  };

  const playPauseIcon = status === 'playing' ? 'pause' : 'play';

  return (
    <View mt="8" zIndex="1">
      <Center>
        <View>
          <Image
            source={{uri: image}}
            style={{
              width: width * 0.7,
              height: height * 0.22,
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
            borderRadius="6"
            fontFamily="CenturyGothic"
            style={{height: height * 0.2}}>
            <RenderHtml contentWidth={width} source={{html: description}} />
          </ScrollView>
        </View>
        <View style={{width: width}} mt="3">
          <HStack
            space="3"
            alignItems="center"
            justifyContent="flex-start"
            bg="primary.100"
            mx="10"
            px="2"
            borderRadius="20">
            <Icon
              as={MaterialCommunityIcons}
              name="rewind"
              onPress={() => onForwardBackward('prev')}
              size="lg"
              color="primary.600"
            />
            <Icon
              as={MaterialCommunityIcons}
              name={playPauseIcon}
              onPress={onPlayPausePress}
              size="lg"
              color="primary.600"
            />
            <Icon
              as={MaterialCommunityIcons}
              name="fast-forward"
              onPress={() => onForwardBackward('next')}
              size="lg"
              color="primary.600"
            />
            <Slider
              value={position}
              maxValue={duration}
              onChange={val => onPositionChange(val)}
              size="sm"
              w="3/5">
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </HStack>
        </View>
      </Center>
    </View>
  );
};
