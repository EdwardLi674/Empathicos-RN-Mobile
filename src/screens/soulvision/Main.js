import React, {useState, useEffect} from 'react';
import {Image, ActivityIndicator, useWindowDimensions} from 'react-native';
import {Center, VStack, Pressable, View, Box} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {EmpaBtn} from '../../components/EmpaBtn';
import {FormBtn} from '../../components/FormBtn';

export const SoulVision = props => {
  const id = props.route.params.id;
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);

  const screenInfo = {
    title: 'Soul Vision',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  useEffect(() => {
    getSubCategoryMenus();
  }, []);

  const getSubCategoryMenus = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/dashboard-subcategory/${id}`;
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
        setMenus(resResult.results);
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

  const onEmpaBtnPress = id => {
    const targetMenu = menus.find(menu => menu.id === id);
    const title = targetMenu.title;
    switch (title) {
      case 'Journeys':
        props.navigation.navigate('journeys');
        break;
      case 'Audio Courses':
        props.navigation.navigate('audio_courses');
        break;
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
          <View zIndex={1} style={{marginTop: height * 0.2}}>
            <VStack space={20} pb="5">
              {menus.map(menu => (
                <EmpaBtn
                  title={menu.title}
                  key={menu.id}
                  info={menu.description}
                  onBtnPress={() => onEmpaBtnPress(menu.id)}
                  ht={45}
                  textMT={-9}
                  iconMT={-8}
                />
              ))}
            </VStack>
          </View>
        )}
      </Layout>
    </>
  );
};
