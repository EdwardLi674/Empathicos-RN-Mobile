import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Center,
  View,
  Text,
  HStack,
  Pressable,
  Icon,
  ScrollView,
} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';

export const Favorite = props => {
  const isFocused = useIsFocused();

  const screenInfo = {
    title: 'Favorites',
    subTitle: '',
    header: '1',
    footer: '0',
  };

  const regex = /(<([^>]+)>)/gi;
  const {height, width} = useWindowDimensions();

  const {userData} = useUser();

  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    onFavoritesLoad();
  }, [isFocused]);

  const onFavoritesLoad = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/favorites`;
    var options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      setLoading(true);
      const result = await fetch(url, options);
      const resResult = await result.json();
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      } else {
        if (resResult.results) setFavorites(resResult.results);
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
    <>
      <Layout screenInfo={screenInfo}>
        {loading ? (
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{marginTop: '50%'}}
          />
        ) : (
          <ScrollView style={{height: height * 0.27}} mt={height * 0.07}>
            <Center zIndex="1">
              {favorites.map(favorite => (
                <Pressable
                  key={favorite.id}
                  mb="2"
                  mx="4"
                  borderColor="amber.400"
                  borderWidth="2"
                  borderRadius="10"
                  onPress={() =>
                    props.navigation.navigate('journey_detail', {
                      id: favorite.id,
                    })
                  }>
                  <HStack alignItems="center" w="full">
                    <Center
                      bg="black"
                      w="1/4"
                      style={{height: height * 0.14}}
                      p="1"
                      borderLeftRadius="10">
                      <Image
                        source={{
                          uri: favorite.imageURI,
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
                        {favorite.name}
                      </Text>
                      <View style={{height: height * 0.1}}>
                        <Text fontFamily="CenturyGothic" color="white">
                          {favorite.description.replace(regex, '')}
                        </Text>
                      </View>
                    </View>
                  </HStack>
                </Pressable>
              ))}
            </Center>
          </ScrollView>
        )}
      </Layout>
    </>
  );
};
