import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/core';
import {Image, useWindowDimensions, StyleSheet} from 'react-native';
import {
  Center,
  View,
  ScrollView,
  FormControl,
  TextArea,
  Text,
  KeyboardAvoidingView,
  Pressable,
} from 'native-base';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';
import {FormInput} from '../../components/FormInput';
import {baseUrl} from '../../utils/util';

export const Register = () => {
  const screenInfo = {
    title: 'Empathicos',
    subTitle: '',
    header: '0',
    footer: '0',
  };
  const navigation = useNavigation();
  const {height, width} = useWindowDimensions();

  const user = useUser();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [PasswordErr, setPasswordErr] = useState('');

  const onRegister = async () => {
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

    if (!password) {
      setPasswordErr('Password is required.');
      return;
    }

    if (PasswordErr !== '') return;

    const url = `${baseUrl}/auth/register`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
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
        user.onUser(resResult.results);
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

  const onPasswordChanged = txt => {
    if (txt !== confirmpassword) {
      setPasswordErr('Not matched confirmed password.');
    } else {
      setPasswordErr('');
    }
    setPassword(txt);
  };

  const onConfirmPasswordChanged = txt => {
    if (password !== txt) {
      setPasswordErr('Not matched confirmed password.');
    } else {
      setPasswordErr('');
    }
    setConfirmPassword(txt);
  };

  const onLoginPress = () => {
    navigation.navigate('login');
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
          <ScrollView px="6" pt="2">
            <Center>
              <Text
                color="light.50"
                fontFamily="CenturyGothic"
                fontWeight="700"
                fontSize="2xl"
                textAlign="center">
                Register
              </Text>
              <FormInput
                mt="2"
                label="Email"
                isRequired={true}
                errMsg={emailErr}
                value={email}
                onChange={txt => onEmailChanged(txt)}
              />
              <FormInput
                mt="4"
                label="Password"
                isRequired={true}
                errMsg={PasswordErr}
                value={password}
                onChange={txt => onPasswordChanged(txt)}
              />
              <FormInput
                mt="4"
                label="Confirm Password"
                isRequired={false}
                value={confirmpassword}
                onChange={txt => onConfirmPasswordChanged(txt)}
              />
              <View mt="8">
                <FormBtn
                  title="Register"
                  onBtnPress={() => onRegister()}
                  loading={loading}
                />
              </View>
              <View mt="3" mb="5">
                <Pressable onPress={onLoginPress}>
                  <Text
                    color="pink.700"
                    fontFamily="CenturyGothic"
                    fontSize="lg"
                    fontWeight="bold">
                    Login
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
