import React, {useState, useEffect, useRef} from 'react';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/core';
import {useWindowDimensions, TextInput, StyleSheet} from 'react-native';
import {
  Center,
  View,
  ScrollView,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Icon,
} from 'native-base';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';
import {FormInput} from '../../components/FormInput';
import {baseUrl} from '../../utils/util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CODE_LENGTH = 6;

export const PasswordUpdate = () => {
  const screenInfo = {
    title: 'Empathicos',
    subTitle: '',
    header: '0',
    footer: '0',
  };

  const {height, width} = useWindowDimensions();

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [containerIsFocused, setContainerIsFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [PasswordErr, setPasswordErr] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const ref = useRef(null);

  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  const toDigitInput = (_value, idx) => {
    const emptyInputChar = ' ';
    const digit = code[idx] || emptyInputChar;

    const isCurrentDigit = idx === code.length;
    const isLastDigit = idx === CODE_LENGTH - 1;
    const isCodeFull = code.length === CODE_LENGTH;

    const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const containerStyle =
      containerIsFocused && isFocused
        ? {...style.inputContainer, ...style.inputContainerFocused}
        : style.inputContainer;

    return (
      <View key={idx} style={containerStyle}>
        <Text style={style.inputText}>{digit}</Text>
      </View>
    );
  };

  const handleOnPress = () => {
    setContainerIsFocused(true);
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  const onSubmit = async () => {
    if (!password) {
      setPasswordErr('Password is required.');
      return;
    }

    if (PasswordErr !== '') return;

    const url = `${baseUrl}/auth/password/reset`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        token: code,
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
        setIsUpdated(true);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onContinuePress = () => {
    navigation.navigate('login');
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

  return (
    <>
      <Layout screenInfo={screenInfo}>
        {isUpdated ? (
          <View
            w={width * 0.9}
            h={height * 0.5}
            ml="6"
            mt={height * 0.09}
            bg="primary.600"
            borderColor="amber.300"
            borderWidth="2"
            borderRadius="md"
            zIndex={1}>
            <Center mt="10" mx="6">
              <Icon
                as={MaterialCommunityIcons}
                name="lock-check-outline"
                color="white"
                size="20"
              />
              <Text
                fontFamily="CenturyGothic"
                fontSize="xl"
                color="white"
                textAlign="center"
                mt="6">
                Your password is updated successfully.
              </Text>
              <View mt="20">
                <Pressable onPress={onContinuePress}>
                  <Text
                    color="pink.700"
                    fontFamily="CenturyGothic"
                    fontSize="2xl"
                    fontWeight="bold">
                    Continue
                  </Text>
                </Pressable>
              </View>
            </Center>
          </View>
        ) : (
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
              <Center mb="8">
                <Text
                  color="light.50"
                  fontFamily="CenturyGothic"
                  fontSize="lg"
                  textAlign="center"
                  mb="2">
                  Enter the 6 digits code sent to your email.
                </Text>
                <Pressable
                  style={style.inputsContainer}
                  onPress={handleOnPress}>
                  {codeDigitsArray.map(toDigitInput)}
                </Pressable>
                <TextInput
                  ref={ref}
                  value={code}
                  onChangeText={setCode}
                  onSubmitEditing={handleOnBlur}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  textContentType="oneTimeCode"
                  maxLength={CODE_LENGTH}
                  style={style.hiddenCodeInput}
                />
                <Text
                  color="light.50"
                  fontFamily="CenturyGothic"
                  fontSize="lg"
                  textAlign="center"
                  mt="6">
                  Set the new password for your account.
                </Text>
                <FormInput
                  label="Password"
                  isRequired={true}
                  errMsg={PasswordErr}
                  value={password}
                  onChange={txt => onPasswordChanged(txt)}
                />
                <FormInput
                  mt="2"
                  label="Confirm Password"
                  isRequired={false}
                  value={confirmpassword}
                  onChange={txt => onConfirmPasswordChanged(txt)}
                />
                <View mt="4">
                  <FormBtn
                    title="Reset Password"
                    onBtnPress={() => onSubmit()}
                    loading={loading}
                  />
                </View>
                <View mt="4">
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
        )}
      </Layout>
    </>
  );
};

const style = StyleSheet.create({
  inputsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputContainer: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 36,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginHorizontal: 6,
  },
  inputText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'CenturyGothic',
  },
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
});
