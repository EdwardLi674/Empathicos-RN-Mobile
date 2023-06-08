import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {Center, View, ScrollView, Text} from 'native-base';
import RenderHtml from 'react-native-render-html';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';

export const About = props => {
  const info = props.route.params.about;

  const screenInfo = {
    title: 'About',
    subTitle: info.name,
    header: '2',
    footer: '0',
  };
  const {height, width} = useWindowDimensions();

  return (
    <Layout screenInfo={screenInfo}>
      <Center mt={height * 0.03}>
        <Image
          source={{
            uri: info?.image,
          }}
          style={{
            height: '18%',
            width: '25%',
            borderRadius: 10,
            zIndex: 1,
          }}
        />
        <View
          w={width * 0.9}
          h={height * 0.47}
          bg="primary.600"
          borderColor="amber.300"
          borderWidth="2"
          borderRadius="md"
          mt="-6">
          <ScrollView px="3" mt="6">
            {info && (
              <RenderHtml
                contentWidth={width}
                source={{html: info?.description}}
                tagsStyles={{p: {color: '#1d4ed8', fontSize: 18}}}
              />
            )}
          </ScrollView>
        </View>
      </Center>
    </Layout>
  );
};
