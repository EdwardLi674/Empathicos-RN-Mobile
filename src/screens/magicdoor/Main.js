import React, {useState, useEffect} from 'react';
import {Image, ActivityIndicator, useWindowDimensions} from 'react-native';
import {Center, VStack, View, Text} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {EmpaBtn} from '../../components/EmpaBtn';
import {FormBtn} from '../../components/FormBtn';

export const EnterMagicDoor = props => {
  const id = props.route.params.id;
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const screenInfo = {
    title: 'Empathicos',
    subTitle: 'Discover Your Magic!',
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

  const onEmpaBtnPress = (menu, idx) => {
    // const targetMenu = menus.find(menu => menu.id === id);
    // const title = targetMenu.title;
    switch (idx) {
      case 0:
        props.navigation.navigate('journey');
        break;
      case 1:
        props.navigation.navigate('mini_course', {
          id: menu.id,
          title: menu.title,
        });
        break;
      case 2:
        props.navigation.navigate('mini_course', {
          id: menu.id,
          title: menu.title,
        });
        break;
      case 3:
        props.navigation.navigate('my_journal');
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
          <View zIndex={1} style={{marginTop: height * 0.1}}>
            <Text
              color="light.50"
              fontFamily="CenturyGothic"
              fontSize="xl"
              textAlign="center"
              mb="8">
              Choose Your Journey
            </Text>
            <VStack space={8} pb="5">
              {menus.map((menu, idx) => (
                <EmpaBtn
                  title={menu.title}
                  key={menu.id}
                  info={menu.description}
                  onBtnPress={() => onEmpaBtnPress(menu, idx)}
                  ht={45}
                  textMT={-9}
                  iconMT={-22}
                />
              ))}
            </VStack>
          </View>
        )}
      </Layout>
    </>
  );
};
