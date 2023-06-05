import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {
  ScrollView,
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
  Center,
  View,
  Badge,
  Button,
} from 'native-base';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import {Rating} from 'react-native-ratings';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {useCart} from '../../context/Cart';

export const Shop = () => {
  const isFocused = useIsFocused();

  const {height, width} = useWindowDimensions();
  const {userData} = useUser();
  const {onCart, cartData} = useCart();

  const navigation = useNavigation();

  const screenInfo = {
    title: 'Shop',
    subTitle: '',
    header: '2',
    footer: '1',
    isCart: true,
  };

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProducts();
  }, []);

  const getProducts = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/products`;
    var options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const result = await fetch(url, options);
      const resResult = await result.json();
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
        setProducts([]);
      } else {
        setProducts(resResult.results);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    } finally {
      setLoading(false);
    }
  };

  const onAddCartPress = product => {
    const tempCartData = [...cartData];
    const productId = product.id;
    const productInCart = tempCartData.find(
      prodCart => prodCart.id === productId,
    );

    if (productInCart) return;

    const productAddedToCart = {...product, amount: 1};
    tempCartData.push(productAddedToCart);
    onCart(tempCartData);
  };

  const onBuyNowPress = product => {
    navigation.navigate('buy_product', {product: product});
  };

  const onDetailPress = product => {
    navigation.navigate('product', {detail: product});
  };

  return (
    <Layout screenInfo={screenInfo}>
      {loading ? (
        <ActivityIndicator
          color="#fff"
          size="large"
          style={{marginTop: '50%'}}
        />
      ) : (
        <ScrollView style={{height: height * 0.65}} mt={height * 0.07}>
          <Center mb={height * 0.14}>
            {products.map(product => (
              <Pressable
                key={product.id}
                onPress={() => onDetailPress(product)}>
                <HStack
                  style={{width: width * 0.92}}
                  bg="primary.700"
                  p="3"
                  mb="4"
                  alignItems="center"
                  borderColor="amber.400"
                  borderRadius="10"
                  borderWidth="2">
                  <Image
                    source={{uri: product.img}}
                    style={{
                      width: width * 0.3,
                      height: '100%',
                      resizeMode: 'cover',
                      borderRadius: 10,
                    }}
                  />
                  <VStack space="2" px="2" style={{width: width * 0.6}}>
                    <Text
                      fontSize="lg"
                      color="white"
                      fontFamily="CenturyGothic">
                      {product.name}
                    </Text>
                    <Rating
                      ratingCount={5}
                      startingValue={Math.round(product.ratings * 100) / 100}
                      readonly
                      imageSize={16}
                      style={{
                        marginLeft: width * -0.35,
                      }}
                      tintColor="#0e7490"
                    />
                    <Text fontSize="2xl" bold color="amber.300">
                      <Text fontSize="md">$</Text>
                      {product.price}
                    </Text>
                    <HStack space="4">
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="secondary"
                        py="1"
                        isDisabled={
                          cartData.find(cd => cd.id === product.id)
                            ? true
                            : false
                        }
                        onPress={() => onAddCartPress(product)}
                        _text={{color: 'white', fontFamily: 'CenturyGothic'}}>
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="secondary"
                        py="1"
                        onPress={() => onBuyNowPress(product)}
                        _text={{color: 'white', fontFamily: 'CenturyGothic'}}>
                        Buy Now
                      </Button>
                    </HStack>
                  </VStack>
                </HStack>
              </Pressable>
            ))}
          </Center>
        </ScrollView>
      )}
    </Layout>
  );
};
