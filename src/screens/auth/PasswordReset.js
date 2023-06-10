import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/core';
import {useWindowDimensions} from 'react-native';
import {
  Center,
  View,
  ScrollView,
  Pressable,
  Text,
  KeyboardAvoidingView,
} from 'native-base';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';
import {FormInput} from '../../components/FormInput';
import {baseUrl} from '../../utils/util';

export const PasswordReset = () => {
  const screenInfo = {
    title: 'Empathicos',
    subTitle: '',
    header: '0',
    footer: '0',
  };

  const {height, width} = useWindowDimensions();

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');

  const onSubmit = async () => {
    if (!email) {
      setEmailErr('Email is required.');
      return;
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(email) === false) {
        setEmailErr('Email is incorrect.');
        return;
      }
    }

    const url = `${baseUrl}/auth/password/email`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
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
      } else {
        Toast.show({
          type: 'success',
          text1: 'Password Recovery',
          text2: resResult.message,
          visibilityTime: 6000,
        });
        navigation.navigate('password_update');
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onEmailChanged = txt => {
    setEmailErr('');
    setEmail(txt);
  };

  return (
    <>
      <Layout screenInfo={screenInfo}>
        <KeyboardAvoidingView
          w={width * 0.9}
          h={height * 0.53}
          ml="6"
          mt={height * 0.07}
          bg="primary.600"
          borderColor="amber.300"
          borderWidth="2"
          borderRadius="md"
          zIndex={1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView px="6" pt={height * 0.02}>
            <Center>
              <Text
                color="light.50"
                fontFamily="CenturyGothic"
                fontWeight="700"
                fontSize="2xl"
                textAlign="center">
                Password Reset
              </Text>
              <Text
                color="light.50"
                fontFamily="CenturyGothic"
                fontSize="md"
                textAlign="center"
                mt="4">
                Enter your email for the verification process. We will send 6
                digits code to your email.
              </Text>
              <FormInput
                mt="4"
                label="Email"
                isRequired={true}
                errMsg={emailErr}
                value={email}
                onChange={txt => onEmailChanged(txt)}
              />
              <View mt="6">
                <FormBtn
                  title="Submit"
                  onBtnPress={() => onSubmit()}
                  loading={loading}
                />
              </View>
              <View mt="6">
                <Pressable onPress={() => navigation.goBack()}>
                  <Text
                    color="green.300"
                    fontFamily="CenturyGothic"
                    fontSize="lg">
                    Go Back
                  </Text>
                </Pressable>
              </View>
            </Center>
          </ScrollView>
        </KeyboardAvoidingView>
      </Layout>
    </>
  );
};
