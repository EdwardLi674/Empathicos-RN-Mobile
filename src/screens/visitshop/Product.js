import React, {useState, useEffect, useRef} from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {
  View,
  HStack,
  Button,
  Icon,
  ScrollView,
  Center,
  Text,
} from 'native-base';
import RenderHtml from 'react-native-render-html';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';

export const Product = props => {
  const productDetail = props.route.params.detail;

  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const screenInfo = {
    title: 'Product Detail',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  return (
    <>
      <Layout screenInfo={screenInfo}>
        <ScrollView style={{height: height * 0.35}} mt={height * 0.07}>
          <Center>
            <Image
              source={{uri: productDetail.img}}
              style={{
                width: width * 0.8,
                height: height * 0.25,
                borderRadius: 10,
                borderColor: 'white',
                borderWidth: 2,
                resizeMode: 'stretch',
              }}
            />
            <View
              style={{width: width * 0.8}}
              mt="3"
              bg="primary.100"
              mx="10"
              pl="4"
              pr="2"
              py="1"
              borderRadius="6"
              fontFamily="CenturyGothic">
              <Text fontSize="xl" textAlign="center" lineHeight="24">
                {productDetail.name}
              </Text>
              <RenderHtml
                contentWidth={width}
                source={{html: productDetail.description}}
              />
            </View>
          </Center>
        </ScrollView>
      </Layout>
    </>
  );
};
