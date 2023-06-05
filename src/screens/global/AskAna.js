import React, {useState, useEffect, useRef} from 'react';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/core';
import {useWindowDimensions, Image} from 'react-native';
import {
  Center,
  HStack,
  View,
  ScrollView,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Button,
} from 'native-base';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';
import {baseUrl} from '../../utils/util';
import {PlainTextArea} from '../../components/PlainTextArea';
import {PlainInput} from '../../components/PlainInput';
import {PlainBtn} from '../../components/PlainBtn';

export const AskAna = props => {
  const screenInfo = {
    title: 'Ask Ana',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  const {height, width} = useWindowDimensions();

  const navigation = useNavigation();

  const {userData} = useUser();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const onSubmit = async () => {
    if (!message) {
      Toast.show({
        type: 'error',
        text1: 'Your message is required.',
      });
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Your email is required.',
      });
      return;
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(email) === false) {
        Toast.show({
          type: 'error',
          text1: 'Your email is incorrect format.',
        });
        return;
      }
    }

    const url = `${baseUrl}/questions/ask-ana`;
    const token = userData.access_token;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        user_name: name,
        user_email: email,
        content: message,
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
          text1: resResult.message,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onEmailChange = txt => {
    setEmail(txt);
  };

  const onMessageChange = txt => {
    setMessage(txt);
  };

  const onNameChange = txt => {
    setName(txt);
  };

  return (
    <>
      <Layout screenInfo={screenInfo}>
        <KeyboardAvoidingView
          w={width * 0.9}
          h={height * 0.53}
          ml="6"
          mt={height * 0.07}
          bg="white"
          opacity="0.85"
          borderRadius="xl"
          zIndex={1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView px="6" pt="2">
            <HStack space={3} justifyContent="flex-start">
              <Image
                source={require('../../assets/imgs/ana_photo.png')}
                style={{
                  width: width * 0.1,
                  height: width * 0.1,
                  resizeMode: 'cover',
                }}
              />
              <Text
                color="#0544a1"
                fontFamily="CenturyGothic"
                fontWeight="700"
                fontSize="2xl"
                mt="1"
                ml="2">
                Ask me anything
              </Text>
            </HStack>
            <Center>
              <View w="full" mt="2">
                <PlainTextArea
                  value={message}
                  onChange={onMessageChange}
                  height={150}
                  borderColor="#0544a1"
                  placeholderColor="gray.500"
                  borderRadius="lg"
                  placeholder="Your message"
                />
              </View>
              <View w="full" mt="2">
                <PlainInput
                  value={name}
                  onChange={onNameChange}
                  borderColor="#0544a1"
                  borderRadius="lg"
                  placeholder="Your name"
                />
              </View>
              <View w="full" mt="2">
                <PlainInput
                  value={email}
                  onChange={onEmailChange}
                  borderColor="#0544a1"
                  borderRadius="lg"
                  placeholder="Your email"
                />
              </View>
              <View mt="2">
                <PlainBtn
                  loading={loading}
                  isDisable={false}
                  onPress={onSubmit}
                  btnLabel="Submit"
                />
              </View>
            </Center>
          </ScrollView>
        </KeyboardAvoidingView>
        <Center mt="2">
          <Button
            bg="amber.400"
            zIndex={1}
            _text={{
              color: 'gray.700',
              fontFamily: 'CenturyGothic',
              fontWeight: 'bold',
            }}
            onPress={() => {
              props.navigation.navigate('visit_shop');
            }}>
            Book a Reading
          </Button>
        </Center>
      </Layout>
    </>
  );
};
