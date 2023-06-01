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
} from 'native-base';
import RenderHtml from 'react-native-render-html';
import {Layout} from '../../components/Layout';
import {useCart} from '../../context/Cart';
import {ConfirmDialog} from './components/ConfirmDialog';

export const Cart = props => {
  const {height, width} = useWindowDimensions();
  const {cartData, onCart} = useCart();

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [targetId, setTargetId] = useState(0);

  const screenInfo = {
    title: 'Your Cart',
    subTitle: '',
    header: '2',
    footer: '1',
    isCart: true,
  };

  const onPlusPress = product_id => {
    const newCartData = cartData.map(prod =>
      prod.id === product_id ? {...prod, amount: prod.amount + 1} : prod,
    );
    onCart(newCartData);
  };

  const onMinusPress = product_id => {
    const newCartData = cartData.map(prod => {
      if (prod.id === product_id && prod.amount > 1) {
        return {...prod, amount: prod.amount - 1};
      } else {
        return prod;
      }
    });
    onCart(newCartData);
  };

  const onDeletePress = product_id => {
    setTargetId(product_id);
    setIsOpenDialog(true);
  };

  const onCloseDialog = selected => {
    if (selected === 'ok') {
      const newCartData = cartData.filter(prod => prod.id !== targetId);
      onCart(newCartData);
    }
    setIsOpenDialog(false);
  };

  return (
    <Layout screenInfo={screenInfo}>
      <ScrollView style={{height: height * 0.23}} mt={height * 0.07}>
        <Center>
          {cartData.map(product => (
            <View
              key={product.id}
              style={{width: width * 0.92}}
              bg="primary.700"
              px="3"
              pb="3"
              mb="4"
              alignItems="center"
              borderColor="amber.400"
              borderRadius="10"
              borderWidth="2">
              <Image
                source={require('../../assets/imgs/cart_item_cap.png')}
                style={{width: width * 0.95, height: width * 0.15}}
              />
              <Text
                color="amber.300"
                fontSize="22"
                fontFamily="CenturyGothic"
                mt={-height * 0.06}>
                {product.name}
              </Text>
              <HStack mt={height * 0.03}>
                <Image
                  source={{uri: product.img}}
                  style={{
                    width: '35%',
                    height: '100%',
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}
                />
                <View h={height * 0.15} width="65%" ml="2">
                  <ScrollView>
                    <RenderHtml
                      contentWidth={width}
                      source={{html: product.description}}
                      tagsStyles={{
                        p: {color: 'white', fontSize: 16, marginTop: 0},
                      }}
                    />
                  </ScrollView>
                </View>
              </HStack>
              <HStack mt="4">
                <View width="35%">
                  <Text textAlign="center" color="amber.400" fontSize="18" bold>
                    ${product.price}
                  </Text>
                </View>
                <View width="55%" pl="4">
                  <HStack>
                    <IconButton
                      color="white"
                      variant="solid"
                      size="8"
                      _icon={{
                        as: MaterialCommunityIcons,
                        name: 'minus',
                      }}
                      onPress={() => onMinusPress(product.id)}
                    />
                    <Text color="white" fontSize="20" bold mx="3">
                      {product.amount}
                    </Text>
                    <IconButton
                      color="white"
                      variant="solid"
                      size="8"
                      _icon={{
                        as: MaterialCommunityIcons,
                        name: 'plus',
                      }}
                      onPress={() => onPlusPress(product.id)}
                    />
                  </HStack>
                </View>
                <View width="10%" alignItems="flex-end">
                  <Icon
                    as={MaterialCommunityIcons}
                    name="delete"
                    color="red.500"
                    size={8}
                    onPress={() => onDeletePress(product.id)}
                  />
                </View>
              </HStack>
            </View>
          ))}
        </Center>
      </ScrollView>
      <Center>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          width={width * 0.92}
          bgColor="primary.600"
          borderRadius="6"
          mt={height * 0.04}
          px="3"
          py="1">
          <Text color="white" fontSize="18" fontFamily="CenturyGothic" bold>
            TOTAL: $
            {cartData.reduce(
              (accumulator, currentProduct) =>
                accumulator +
                currentProduct.amount * parseFloat(currentProduct.price),
              0,
            )}
          </Text>
          <Button
            variant="link"
            _text={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'CenturyGothic',
              textDecorationLine: 'underline',
            }}
            onPress={() => props.navigation.navigate('order')}>
            Checkout
          </Button>
        </HStack>
      </Center>
      <ConfirmDialog isOpen={isOpenDialog} onClosed={onCloseDialog} />
    </Layout>
  );
};
