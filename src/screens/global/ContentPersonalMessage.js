import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {View, ScrollView, Center} from 'native-base';
import Toast from 'react-native-toast-message';
import RenderHtml from 'react-native-render-html';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';

export const ContentPersonalMessage = () => {
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const screenInfo = {
    title: 'Personal Message',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent();
  }, []);

  const getContent = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/dashboard-category/personal-message`;
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
      } else {
        setContent(resResult.results);
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

  return (
    <Layout screenInfo={screenInfo}>
      {loading ? (
        <ActivityIndicator
          color="#fff"
          size="large"
          style={{marginTop: '50%'}}
        />
      ) : (
        <Center style={{marginTop: height * 0.05}}>
          <View>
            <Image
              source={{uri: content.image}}
              style={{
                width: width * 0.8,
                height: height * 0.27,
                borderRadius: 10,
                borderColor: 'white',
                borderWidth: 4,
              }}
            />
          </View>
          <View style={{width: width}} mt="3">
            <ScrollView
              bg="primary.100"
              mx="10"
              px="3"
              py="1"
              borderRadius="6"
              fontFamily="CenturyGothic"
              style={{height: height * 0.26}}>
              <RenderHtml
                contentWidth={width}
                source={{html: content.description}}
              />
            </ScrollView>
          </View>
        </Center>
      )}
    </Layout>
  );
};
