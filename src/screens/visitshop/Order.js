import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
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
  IconButton,
} from 'native-base';
import {useStripe} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import {Layout} from '../../components/Layout';
import {useCart} from '../../context/Cart';
import {useUser} from '../../context/User';
import {baseUrl, paypal_client_id, paypal_secret} from '../../utils/util';
import Base64 from './components/Base64';

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
  const [shippingCharge, setShippingCharge] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  // const [stripeLoading, setStripeLoading] = useState(false);
  // const [paypalLoading, setPaypalLoading] = useState(false);

  // paypal payment state variables
  const [accessToken, setAccessToken] = useState(null);
  const [approvalUrl, setApprovalUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showPaypalPanel, setShowPaypalPanel] = useState(false);

  useEffect(() => {
    // initializeStripePayment();
    // initializePaypalPayment();
    initializePayment();
  }, [isFocused]);

  const onPaymentBtnPress = () => {
    if (paymentMethod === 'credit_card') {
      openStripePayment();
    } else {
      openPaypalPayment();
    }
  };

  const initializePayment = async () => {
    const token = userData.access_token;

    setLoading(true);
    // getting the shipping charge value set by admin
    var url = `${baseUrl}/payment/shipping-charges`;
    var shipping_charge = 0;
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
        return;
      } else {
        shipping_charge = parseFloat(resResult.results.shipping_charge);
        setShippingCharge(shipping_charge);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }

    const totalAmount =
      cartData.reduce(
        (accumulator, currentProduct) =>
          accumulator +
          currentProduct.amount * parseFloat(currentProduct.price),
        0,
      ) + shipping_charge;

    /* ----------------- Stripe payment -----------------*/
    var url = `${baseUrl}/payment/stripe`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        amount: totalAmount * 100,
      }),
    };
    try {
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
        if (error) {
          Toast.show({
            type: 'error',
            text1: 'Stripe payment initialization error',
          });
        }
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }

    /* ----------------- Paypal payment -----------------*/
    const dataDetail = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            total: totalAmount.toString(),
            currency: 'USD',
            details: {
              subtotal: totalAmount.toString(),
              tax: '0.00',
              shipping: '0.00',
              handling_fee: '0.00',
              shipping_discount: '0.00',
              insurance: '0.00',
            },
          },
          description: 'The payment transaction description.',
        },
      ],
      note_to_payer: 'Contact us for any questions on your order.',
      redirect_urls: {
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel',
      },
    };

    try {
      // getting access_token which will be used for bear token in next api call
      var url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
      var options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization:
            'Basic ' + Base64.btoa(`${paypal_client_id}:${paypal_secret}`),
        },
        body: 'grant_type=client_credentials',
      };
      var result = await fetch(url, options);
      var resResult = await result.json();
      const access_token = resResult.access_token;
      setAccessToken(access_token);

      // getting payment id and approval url
      var url = 'https://api.sandbox.paypal.com/v1/payments/payment';
      var options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
        body: JSON.stringify(dataDetail),
      };
      var result = await fetch(url, options);
      var resResult = await result.json();
      const payment_id = resResult.id;
      const links = resResult.links;
      const approval_url = links.find(data => data.rel == 'approval_url');
      setPaymentId(payment_id);
      setApprovalUrl(approval_url.href);
      setLoading(false);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  /* ----------------- Stripe payment -----------------*/
  const openStripePayment = async () => {
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
      savePaymentData('stripe');
    }
  };

  /* ----------------- Paypal payment -----------------*/
  const openPaypalPayment = () => {
    setShowPaypalPanel(true);
  };

  const onNavigationStateChange = async webViewState => {
    if (webViewState.url.includes('https://example.com/')) {
      setApprovalUrl(null);

      // const {PayerID, paymentId} = webViewState.url;
      const PayerID = getParamFromUrl('PayerID', webViewState.url);
      const paymentId = getParamFromUrl('paymentId', webViewState.url);
      // getting payment id and approval url
      var url = `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`;
      var options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
        body: JSON.stringify({payer_id: PayerID}),
      };
      var result = await fetch(url, options);
      var resResult = await result.json();

      // if payment is success then
      if (resResult.create_time && resResult.create_time !== '') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your payment is success!',
        });
        setShowPaypalPanel(false);
        savePaymentData('paypal');
      } else {
        Toast.show({
          type: 'error',
          text1: `Failed`,
          text2: 'Your payment is failed!',
        });
      }
    }
  };

  // helper function
  const getParamFromUrl = (name, url) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  const savePaymentData = async payment_method => {
    const url = `${baseUrl}/payment/create`;
    const token = userData.access_token;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        payment_status: 'success',
        payment_method: payment_method,
        items: cartData,
      }),
    };
    setLoading(true);
    try {
      const result = await fetch(url, options);
      const resResult = await result.json();
      setLoading(false);
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      }
      onCart([]);
      props.navigation.navigate('visit_shop');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  return (
    <Layout screenInfo={screenInfo}>
      {showPaypalPanel && approvalUrl ? (
        <Center mt={height * 0.08}>
          <View h="full" width="98%" zIndex="1" pb="10">
            <View w="full" bgColor="white">
              <IconButton
                color="dark.50"
                variant="ghost"
                size="10"
                _icon={{
                  as: MaterialCommunityIcons,
                  name: 'close',
                }}
                onPress={() => setShowPaypalPanel(false)}
              />
            </View>
            <WebView
              source={{uri: approvalUrl}}
              onNavigationStateChange={onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
            />
          </View>
        </Center>
      ) : (
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
                ${shippingCharge.toFixed(2)}
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
                  ) + shippingCharge
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
              {/* <Button
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
              </Button> */}
            </HStack>
            {loading ? (
              <Center
                bg="primary.500"
                borderRadius="4"
                width="95%"
                mt="4"
                py="3">
                <ActivityIndicator size="small" color="white" />
              </Center>
            ) : (
              <Pressable onPress={onPaymentBtnPress}>
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
      )}
    </Layout>
  );
};
