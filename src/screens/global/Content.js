import React from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {View, ScrollView, Center} from 'native-base';
import RenderHtml from 'react-native-render-html';
import {Layout} from '../../components/Layout';

export const Content = props => {
  const menu = props.route.params.menu;
  const menuObj = JSON.parse(menu);

  const {height, width} = useWindowDimensions();

  const screenInfo = {
    title: menuObj.title,
    subTitle: '',
    header: '2',
    footer: '1',
  };

  return (
    <Layout screenInfo={screenInfo}>
      <Center style={{marginTop: height * 0.05}}>
        <View>
          <Image
            source={{uri: menuObj.image}}
            style={{
              width: width * 0.8,
              height: height * 0.27,
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
            style={{height: height * 0.26}}>
            <RenderHtml
              contentWidth={width}
              source={{html: menuObj.description}}
            />
          </ScrollView>
        </View>
      </Center>
    </Layout>
  );
};
