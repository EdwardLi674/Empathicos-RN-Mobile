import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Icon,
  HStack,
  Text,
  Center,
  View,
  Button,
  Divider,
  Pressable,
} from 'native-base';
import {useStripe} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import {Layout} from '../../components/Layout';
import {useCart} from '../../context/Cart';
import {useUser} from '../../context/User';
import {baseUrl} from '../../utils/util';

export const Order = props => {
  const {height, width} = useWindowDimensions();
  const isFocused = useIsFocused();
  const {cartData, onCart} = useCart();
  const {userData} = useUser();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const screenInfo = {
    title: 'Your Order',
    subTitle: '',
    header: '2',
    footer: '1',
    isCart: true,
  };

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePaymentSheet();
  }, [isFocused]);

  const initializePaymentSheet = async () => {
    const totalAmount =
      (cartData.reduce(
        (accumulator, currentProduct) =>
          accumulator +
          currentProduct.amount * parseFloat(currentProduct.price),
        0,
      ) +
        50) *
      100;

    const token = userData.access_token;
    const url = `${baseUrl}/payment/stripe`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        amount: totalAmount,
      }),
    };
    try {
      setLoading(true);
      const result = await fetch(url, options);
      const resResult = await result.json();
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      } else {
        const paymentData = resResult.results;
        const {error} = await initPaymentSheet({
          merchantDisplayName: 'Andrea Plesha',
          customerId: paymentData.customer,
          customerEphemeralKeySecret: paymentData.ephemeralKey,
          paymentIntentClientSecret: paymentData.paymentIntent,
          allowsDelayedPaymentMethods: false,
          defaultBillingDetails: {
            name: 'Naixu Wang',
          },
        });
        if (!error) {
          setLoading(false);
        }
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      if (error.code !== 'Canceled') {
        Toast.show({
          type: 'error',
          text1: `Error code: ${error.code}`,
          text2: error.message,
        });
      }
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your payment is success!',
      });
      onCart([]);
      props.navigation.navigate('visit_shop');
    }
  };

  return (
    <Layout screenInfo={screenInfo}>
      <Center>
        <View
          width={width * 0.92}
          bg="primary.700"
          px="6"
          pb="8"
          mt={height * 0.09}
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
              }
              onPress={() => setPaymentMethod('credit_card')}>
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
              }
              onPress={() => setPaymentMethod('paypal')}>
              Paypal
            </Button>
          </HStack>
          {loading ? (
            <Center bg="primary.500" borderRadius="4" width="95%" mt="4" py="3">
              <ActivityIndicator size="small" color="white" />
            </Center>
          ) : (
            <Pressable onPress={openPaymentSheet}>
              {({isPressed}) => {
                return (
                  <Center>
                    <HStack
                      justifyContent="space-between"
                      alignItems="center"
                      width="95%"
                      bg={isPressed ? 'primary.600' : 'primary.500'}
                      borderRadius="4"
                      mt="4"
                      px="6"
                      py={paymentMethod === 'credit_card' ? '2' : '0'}>
                      <Text
                        color="white"
                        fontSize="18"
                        fontFamily="CenturyGothic">
                        Check out with
                      </Text>
                      {paymentMethod === 'credit_card' ? (
                        <Image
                          source={require('../../assets/imgs/credit_card_1.png')}
                          style={{
                            width: width * 0.15,
                            height: height * 0.05,
                            resizeMode: 'stretch',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/imgs/paypal_logo.png')}
                          style={{
                            width: width * 0.21,
                            height: height * 0.07,
                            resizeMode: 'stretch',
                          }}
                        />
                      )}
                    </HStack>
                  </Center>
                );
              }}
            </Pressable>
          )}
        </View>
      </Center>
    </Layout>
  );
};
