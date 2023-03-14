import React, {useState, useEffect} from 'react';
import {Image, ActivityIndicator, useWindowDimensions} from 'react-native';
import {Center, VStack, Pressable, View, Box} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {EmpaPlainBtn} from '../../components/EmpaPlainBtn';
import {FormBtn} from '../../components/FormBtn';

export const AudioCourses = props => {
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);

  const screenInfo = {
    title: 'Audio Courses',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  useEffect(() => {
    getSubMenus();
  }, []);

  const getSubMenus = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/audio-course/categories`;
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

  const onEmpaPlainBtnPress = id => {
    const menuTitle = menus.find(menu => menu.id === id).title;
    props.navigation.navigate('audio_course', {id: id, title: menuTitle});
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
            <VStack space={10} pb="5">
              {menus.map(menu => (
                <EmpaPlainBtn
                  title={menu.title}
                  key={menu.id}
                  ht={42}
                  textMT={-9}
                  onBtnPress={() => onEmpaPlainBtnPress(menu.id)}
                />
              ))}
            </VStack>
          </View>
        )}
      </Layout>
    </>
  );
};
