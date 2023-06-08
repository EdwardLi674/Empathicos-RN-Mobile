import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  Center,
  View,
  ScrollView,
  FormControl,
  TextArea,
  Text,
  KeyboardAvoidingView,
} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';
import {FormInput} from '../../components/FormInput';
import {FormTextArea} from '../../components/FormTextArea';

export const Invite = () => {
  const isFocused = useIsFocused();
  const {height, width} = useWindowDimensions();

  const {userData, onUser} = useUser();

  const screenInfo = {
    title: 'Invite Friends',
    subTitle: '',
    header: '1',
    footer: '0',
  };

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const onEmailChanged = txt => {
    setEmailErr('');
    setEmail(txt);
  };

  const onInviteSend = async () => {
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

    const token = userData.access_token;
    const url = `${baseUrl}/invitation/send`;
    const bodyData = {
      name,
      email,
      message,
    };
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    };
    setLoading(true);
    // try {
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
        text1: resResult.message,
      });
    }
    // } catch (err) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Network not working',
    //   });
    // }
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
                fontSize="md"
                color="light.50"
                fontFamily="CenturyGothic"
                fontWeight="700"
                textAlign="center">
                We love you! Thank you for sharing the empathicos magic with
                your friends and loved-ones!
              </Text>
              <FormInput
                mt="0"
                label="Name"
                value={name}
                onChange={txt => setName(txt)}
              />
              <FormInput
                mt="2"
                label="Email"
                isRequired={true}
                errMsg={emailErr}
                value={email}
                onChange={txt => onEmailChanged(txt)}
              />
              <FormTextArea
                mt="2"
                label="Message"
                value={message}
                onChange={msg => setMessage(msg)}
              />
              <View my="4">
                <FormBtn
                  title="Send"
                  onBtnPress={onInviteSend}
                  loading={loading}
                />
              </View>
            </Center>
          </ScrollView>
        </KeyboardAvoidingView>
      </Layout>
    </>
  );
};
