import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Center, View, Text, HStack, Pressable, Icon} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';

export const JourneyDetail = props => {
  const id = props.route.params.id;
  // const detailObj = JSON.parse(detail);

  const regex = /(<([^>]+)>)/gi;
  // const desc = detailObj.description.replace(regex, '');

  const screenInfo = {
    title: 'Journey Detail',
    subTitle: '',
    header: '2',
    footer: '0',
  };

  const {height, width} = useWindowDimensions();

  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [showStatus, setShowStatus] = useState('thumbnail');
  const [favoriteStatus, setFavoriteStatus] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const onJourneyDetailLoad = async id => {
        const token = userData.access_token;
        const url = `${baseUrl}/badge/${id}`;
        var options = {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
          },
        };
        setLoading(true);
        try {
          const result = await fetch(url, options);
          const resResult = await result.json();
          if (!resResult.status) {
            Toast.show({
              type: 'error',
              text1: resResult.message,
            });
          } else {
            const detailObj = resResult.results;
            setName(detailObj.name);
            setDescription(detailObj.description.replace(regex, ''));
            setImage(detailObj.image);
            setFavoriteStatus(detailObj.favorite);
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

      onJourneyDetailLoad(id);

      return async () => {
        isActive = false;
      };
    }, [id]),
  );

  const onToJourneyPress = id => {
    props.navigation.navigate('journey_go', {
      id: id,
    });
  };

  const onListViewPress = () => {
    setShowStatus('listview');
  };

  const onThumbnailPress = () => {
    setShowStatus('thumbnail');
  };

  const onFavouriteJourney = async () => {
    if (loadingFavorite) return;

    // change the favorite icon on UI
    setFavoriteStatus(!favoriteStatus);

    // send request
    const token = userData.access_token;
    const url = `${baseUrl}/badges/favorites`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id: id,
        status: favoriteStatus ? 'removed' : 'add',
      }),
    };
    setLoadingFavorite(true);
    try {
      const result = await fetch(url, options);
      const resResult = await result.json();
      setLoadingFavorite(false);
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      } else {
        console.log(resResult.message);
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
          <Center mt="8" zIndex="1">
            <HStack>
              <Pressable onPress={onListViewPress}>
                {showStatus === 'listview' ? (
                  <Image
                    source={require('../../assets/imgs/btn_listview_press.png')}
                    style={{width: 40, height: 30, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={require('../../assets/imgs/btn_listview.png')}
                    style={{width: 40, height: 30, resizeMode: 'contain'}}
                  />
                )}
              </Pressable>
              <Pressable onPress={onThumbnailPress}>
                {showStatus === 'thumbnail' ? (
                  <Image
                    source={require('../../assets/imgs/btn_thumnailview_press.png')}
                    style={{width: 40, height: 30, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={require('../../assets/imgs/btn_thumnailview.png')}
                    style={{width: 40, height: 30, resizeMode: 'contain'}}
                  />
                )}
              </Pressable>
            </HStack>
            {showStatus === 'thumbnail' ? (
              <>
                <Text
                  fontSize="lg"
                  color="white"
                  fontFamily="CenturyGothic"
                  my="3">
                  {name}
                </Text>
                <View>
                  <Image
                    source={require('../../assets/imgs/image_slider_border.png')}
                    style={{
                      width: width * 0.55,
                      height: width * 0.45,
                      borderRadius: 15,
                    }}
                  />
                  <Image
                    source={{
                      uri: image,
                    }}
                    style={{
                      width: width * 0.48,
                      height: width * 0.4,
                      position: 'absolute',
                      top: 10,
                      left: 14,
                      borderRadius: 10,
                    }}
                  />
                </View>
              </>
            ) : (
              <Pressable
                mt="6"
                mb="2"
                mx="4"
                borderColor="amber.400"
                borderWidth="2"
                borderRadius="10">
                <HStack alignItems="center" w="full">
                  <Center
                    bg="black"
                    w="1/4"
                    style={{height: height * 0.14}}
                    p="1"
                    borderLeftRadius="10">
                    <Image
                      source={{
                        uri: image,
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Center>
                  <View
                    bg="primary.600"
                    w="3/4"
                    pl="2"
                    pt="1"
                    borderRightRadius="10">
                    <Text
                      fontFamily="CenturyGothic"
                      fontSize="14"
                      color="white"
                      fontWeight="bold">
                      {name}
                    </Text>
                    <View style={{height: height * 0.1}}>
                      <Text fontFamily="CenturyGothic" color="white">
                        {description}
                      </Text>
                    </View>
                  </View>
                </HStack>
              </Pressable>
            )}
            <Pressable
              mt="3"
              bg="primary.600"
              p="3"
              borderRadius="50"
              onPress={onFavouriteJourney}>
              {favoriteStatus ? (
                <Icon
                  as={MaterialCommunityIcons}
                  name="heart"
                  color="rose.600"
                  size={5}
                />
              ) : (
                <Icon
                  as={MaterialCommunityIcons}
                  name="heart-outline"
                  color="white"
                  size={5}
                />
              )}
            </Pressable>
            <View mt="4">
              <FormBtn
                title="Go to your Journey"
                onBtnPress={() => onToJourneyPress(id)}
              />
            </View>
          </Center>
        )}
      </Layout>
    </>
  );
};
