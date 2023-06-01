import React, {useState} from 'react';
import {Image, useWindowDimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ScrollView,
  IconButton,
  Icon,
  HStack,
  Text,
  Center,
  View,
  Button,
  Divider,
} from 'native-base';
import {Layout} from '../../components/Layout';
import {useCart} from '../../context/Cart';

export const Order = props => {
  const {height, width} = useWindowDimensions();
  const {cartData, onCart} = useCart();

  const screenInfo = {
    title: 'Your Order',
    subTitle: '',
    header: '2',
    footer: '1',
    isCart: true,
  };

  return (
    <Layout screenInfo={screenInfo}>
      <Center>
        <View
          width={width * 0.92}
          bg="primary.700"
          px="6"
          pb="3"
          mt={height * 0.08}
          alignItems="center"
          borderColor="amber.400"
          borderRadius="10"
          borderWidth="2">
          <Image
            source={require('../../assets/imgs/cart_item_cap.png')}
            style={{width: width * 0.95, height: width * 0.15}}
          />
          <Text
            color="white"
            fontSize="20"
            fontFamily="CenturyGothic"
            mt={-height * 0.06}>
            Your Order
          </Text>
          <HStack
            mt={height * 0.05}
            justifyContent="space-between"
            width="full">
            <Text color="white" fontSize="18" fontFamily="CenturyGothic" bold>
              Order Value
            </Text>
            <Text color="white" fontSize="18" fontFamily="CenturyGothic">
              $
              {cartData
                .reduce(
                  (accumulator, currentProduct) =>
                    accumulator +
                    currentProduct.amount * parseFloat(currentProduct.price),
                  0,
                )
                .toFixed(2)}
            </Text>
          </HStack>
          <HStack
            mt={height * 0.01}
            justifyContent="space-between"
            width="full">
            <Text color="white" fontSize="18" fontFamily="CenturyGothic" bold>
              Shipping Charges
            </Text>
            <Text color="white" fontSize="18" fontFamily="CenturyGothic">
              $50.00
            </Text>
          </HStack>
          <Divider mt="2" w="100%" bg="blue.400" />
          <HStack
            mt={height * 0.01}
            justifyContent="space-between"
            width="full">
            <Text color="white" fontSize="18" fontFamily="CenturyGothic" bold>
              Total Value
            </Text>
            <Text color="amber.400" fontSize="18" fontFamily="CenturyGothic">
              $
              {(
                cartData.reduce(
                  (accumulator, currentProduct) =>
                    accumulator +
                    currentProduct.amount * parseFloat(currentProduct.price),
                  0,
                ) + 50
              ).toFixed(2)}
            </Text>
          </HStack>
          <HStack mt={height * 0.05} width="full">
            <Button
              variant="ghost"
              px="1"
              _text={{
                color: 'white',
                fontFamily: 'CenturyGothic',
                fontSize: 18,
              }}
              leftIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="credit-card"
                  size="md"
                  color="white"
                />
              }>
              Credit Card
            </Button>
            <Button
              variant="ghost"
              mx="4"
              px="1"
              _text={{
                color: 'white',
                fontFamily: 'CenturyGothic',
                fontSize: 18,
              }}
              leftIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="wallet"
                  size="md"
                  color="white"
                />
              }>
              Paypal
            </Button>
          </HStack>
        </View>
      </Center>
    </Layout>
  );
};
