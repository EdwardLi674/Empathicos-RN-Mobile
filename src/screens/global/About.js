import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {Center, View, ScrollView, Text} from 'native-base';
import RenderHtml from 'react-native-render-html';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';

export const About = props => {
  const isFocused = useIsFocused();
  const title = props.route.params.title;

  const screenInfo = {
    title: 'About',
    subTitle: title,
    header: '2',
    footer: '0',
  };
  const {height, width} = useWindowDimensions();

  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getAboutInfos();
  }, [isFocused]);

  const getAboutInfos = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/abouts`;
    var options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
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
        const aboutInfos = resResult.results;
        const aboutInfo = aboutInfos.find(
          ai => ai.page.toLowerCase() === title.toLowerCase(),
        );
        setInfo(aboutInfo);
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
        {loading ? (
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{marginTop: '50%'}}
          />
        ) : (
          <Center mt={height * 0.03}>
            <Image
              source={{
                uri: info?.image,
              }}
              style={{
                height: '18%',
                width: '25%',
                borderRadius: 10,
                zIndex: 1,
              }}
            />
            <View
              w={width * 0.9}
              h={height * 0.47}
              bg="primary.600"
              borderColor="amber.300"
              borderWidth="2"
              borderRadius="md"
              mt="-6">
              <ScrollView px="3" mt="6">
                {info && (
                  <RenderHtml
                    contentWidth={width}
                    source={{html: info?.description}}
                    tagsStyles={{p: {color: '#1d4ed8', fontSize: 18}}}
                  />
                )}
              </ScrollView>
            </View>
          </Center>
        )}
      </Layout>
    </>
  );
};
