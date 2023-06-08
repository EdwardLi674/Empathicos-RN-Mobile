import React, {useEffect, useState} from 'react';
import {
  Image,
  useWindowDimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  Icon,
  ScrollView,
  Center,
  Text,
  HStack,
  VStack,
  Pressable,
  View,
  IconButton,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-toast-message';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {EmpaPlainBtn} from '../../components/EmpaPlainBtn';

const CALENDLY_LINK = 'https://calendly.com/anaguidance/coachingcall';

export const ContentMeetAna = props => {
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const regex = /(<([^>]+)>)/gi;

  const screenInfo = {
    title: 'Meet Ana',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isWebview, setIsWebview] = useState(false);

  useEffect(() => {
    getContent();
  }, []);

  const getContent = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/dashboard-category/meet-ana`;
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

  const onFreeCallPress = () => {
    setIsWebview(true);
  };

  const onBookReadingPress = () => {
    props.navigation.navigate('visit_shop');
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
        <Center style={{marginTop: height * 0.07}}>
          {isWebview ? (
            <View h="full" zIndex="1" width="98%" pb="24">
              <View w="full" bgColor="white">
                <IconButton
                  color="dark.50"
                  variant="ghost"
                  size="10"
                  _icon={{
                    as: MaterialCommunityIcons,
                    name: 'close',
                  }}
                  onPress={() => setIsWebview(false)}
                />
              </View>
              <WebView
                source={{uri: CALENDLY_LINK}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
              />
            </View>
          ) : (
            <View style={{height: height * 0.55}}>
              <ScrollView
                bg="primary.100"
                opacity="0.8"
                mx="6"
                py="3"
                px="3"
                borderRadius="6">
                <HStack space={3}>
                  <Image
                    source={{uri: content.image}}
                    style={{
                      height: 120,
                      width: '40%',
                      borderRadius: 10,
                    }}
                  />
                  <VStack space={1} style={{width: '60%'}}>
                    <Text
                      color="blue.700"
                      fontSize="2xl"
                      textAlign="center"
                      fontFamily="CenturyGothic"
                      pt="2">
                      {content.title}
                    </Text>
                    <Text
                      fontSize="md"
                      fontFamily="CenturyGothic"
                      pt="2"
                      color="blue.700">
                      {content.description.replace(regex, '').substring(0, 60)}
                    </Text>
                  </VStack>
                </HStack>
                <Text fontSize="md" fontFamily="CenturyGothic" color="blue.700">
                  {content.description
                    .replace(regex, '')
                    .substring(
                      81,
                      content.description.replace(regex, '').length,
                    )}
                </Text>
              </ScrollView>
              <VStack space={7} alignItems="center" mt="6">
                <EmpaPlainBtn
                  title="Book A Reading"
                  ht={50}
                  textMT={-10}
                  onBtnPress={onBookReadingPress}
                />
                <Pressable alignItems="center" onPress={onFreeCallPress}>
                  <Center>
                    <Image
                      source={require('../../assets/imgs/rectangle_btn.png')}
                      style={{width: 235, height: 50, resizeMode: 'stretch'}}
                    />
                    <HStack>
                      <Icon
                        as={MaterialCommunityIcons}
                        name="phone"
                        color="white"
                        mt="-9"
                        size={5}
                      />
                      <Text
                        fontSize="lg"
                        color="white"
                        style={styles.btn}
                        mt="-10"
                        ml="4">
                        Free Call
                      </Text>
                    </HStack>
                  </Center>
                </Pressable>
              </VStack>
            </View>
          )}
        </Center>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  btn: {
    fontFamily: 'CenturyGothic',
    textTransform: 'capitalize',
  },
});
