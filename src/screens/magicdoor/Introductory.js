import React, {useState, useEffect} from 'react';
import {Image, ActivityIndicator, useWindowDimensions} from 'react-native';
import {Center, VStack, View, Text, ScrollView} from 'native-base';
import RenderHtml from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {EmpaBtn} from '../../components/EmpaBtn';
import {FormBtn} from '../../components/FormBtn';

export const MagicDoorIntroductory = props => {
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);

  const screenInfo = {
    title: 'Empathicos',
    subTitle: 'Discover Your Magic!',
    header: '2',
    footer: '1',
  };

  useEffect(() => {
    getIntroductoryInfo();
  }, []);

  const getIntroductoryInfo = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/magic-door/introductory`;
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
        setInfo(resResult.results);
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

  const onEnter = () => {
    props.navigation.navigate('magic_door_menus');
  };

  return (
    <>
      <Layout screenInfo={screenInfo} bgIdx="6">
        {loading ? (
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{marginTop: '50%'}}
          />
        ) : (
          <View zIndex={1} style={{marginTop: height * 0.07}}>
            {info && (
              <Center>
                <View>
                  <Image
                    source={{uri: info.image}}
                    style={{
                      width: width * 0.9,
                      height: height * 0.25,
                      borderRadius: 6,
                      borderColor: 'white',
                      borderWidth: 4,
                    }}
                  />
                </View>
                <View style={{width: width * 0.9}} mt={height * 0.02}>
                  <Text
                    pt={2}
                    color="blue.700"
                    bg="primary.100"
                    borderRadius="3"
                    fontFamily="CenturyGothic"
                    fontSize="lg"
                    fontWeight="bold"
                    textAlign="center">
                    {info.title}
                  </Text>
                  <ScrollView
                    bg="primary.100"
                    px="3"
                    pb="1"
                    borderRadius="3"
                    fontFamily="CenturyGothic"
                    style={{height: height * 0.2}}>
                    <RenderHtml
                      contentWidth={width}
                      source={{html: info.description}}
                      tagsStyles={{p: {color: '#1d4ed8'}}}
                    />
                  </ScrollView>
                </View>
                <View mt={height * 0.02}>
                  <FormBtn title="Enter" onBtnPress={onEnter} />
                </View>
              </Center>
            )}
          </View>
        )}
      </Layout>
    </>
  );
};
