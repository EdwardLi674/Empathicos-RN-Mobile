import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {
  Center,
  View,
  ScrollView,
  Text,
  Icon,
  HStack,
  KeyboardAvoidingView,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {PlainTextArea} from '../../components/PlainTextArea';
import {FormBtn} from '../../components/FormBtn';

export const Feedback = () => {
  const screenInfo = {
    title: 'Send Feedback',
    subTitle: '',
    header: '2',
    footer: '0',
  };
  const {height, width} = useWindowDimensions();

  const {userData} = useUser();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onMessageChange = txt => {
    setMessage(txt);
  };

  const onSendFeedback = async () => {
    if (!message) {
      Toast.show({
        type: 'error',
        text1: 'Your message is required.',
      });
      return;
    }

    const token = userData.access_token;
    // const user_id = userData.id;
    const url = `${baseUrl}/feedback/send`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        // user_id: user_id,
        message: message,
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

  return (
    <>
      <Layout screenInfo={screenInfo}>
        <Center>
          <KeyboardAvoidingView
            mt={height * 0.08}
            w={width * 0.9}
            h={height * 0.52}
            zIndex="1"
            bg="primary.600"
            borderColor="amber.300"
            borderWidth="2"
            borderRadius="md"
            justifyContent="center">
            <View p="4">
              <HStack justifyContent="center">
                <Icon
                  as={MaterialCommunityIcons}
                  name="message-bulleted"
                  color="white"
                  size={6}
                  mt="2"
                />
                <Text
                  fontSize="17"
                  color="white"
                  ml="4"
                  fontFamily="CenturyGothic">
                  Send as your comment about Empathicos
                </Text>
              </HStack>
              <View mt="4" px="2">
                <PlainTextArea
                  value={message}
                  onChange={onMessageChange}
                  height={240}
                  borderColor="white"
                  placeholder="Message"
                  placeholderColor="gray.200"
                  textColor="white"
                />
              </View>
              <Center mt="5">
                <View w="1/3">
                  <FormBtn
                    loading={loading}
                    onBtnPress={onSendFeedback}
                    title="Send"
                  />
                </View>
              </Center>
            </View>
          </KeyboardAvoidingView>
        </Center>
      </Layout>
    </>
  );
};
