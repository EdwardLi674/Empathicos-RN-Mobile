import React, {useState, useEffect} from 'react';
import {
  Image,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Center, View, Text} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';

export const Journey = props => {
  const screenInfo = {
    title: 'Journeys',
    subTitle: '',
    header: '1',
    footer: '0',
  };

  const {height, width} = useWindowDimensions();

  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    onLoadJourneys();
  }, []);

  const onLoadJourneys = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/badges`;
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
        setJourneys(resResult.results);
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

  const onJourneyItemPress = id => {
    props.navigation.navigate('journey_detail', {
      id: id,
    });
  };

  const badgeItem = ({item}) => (
    <TouchableOpacity
      style={{margin: 6}}
      onPress={() => onJourneyItemPress(item.id)}>
      <Image
        source={require('../../assets/imgs/image_slider_border.png')}
        style={{
          width: (width - 70) / 3,
          height: (width - 80) / 3,
          borderRadius: 15,
        }}
      />
      <Image
        source={{
          uri: item.image,
        }}
        style={{
          width: (width - 130) / 3,
          height: (width - 140) / 3,
          position: 'absolute',
          top: 10,
          left: 10,
          borderRadius: 10,
        }}
      />
      <Center
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          width: (width - 130) / 3,
        }}
        bg="light.50"
        opacity="70">
        <Text fontFamily="CenturyGothic" fontWeight={700}>
          {item.name}
        </Text>
      </Center>
    </TouchableOpacity>
  );

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
          <View
            w={width}
            h={height * 0.53}
            ml="4"
            mt={height * 0.07}
            zIndex={1}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <FlatList
              key={'*'}
              data={journeys}
              renderItem={badgeItem}
              keyExtractor={item => item.id}
              numColumns={3}
              style={{height: '43%'}}
            />
          </View>
        )}
      </Layout>
    </>
  );
};
