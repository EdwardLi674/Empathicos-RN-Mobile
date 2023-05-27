import React, {useState, useEffect} from 'react';
import {ActivityIndicator, useWindowDimensions} from 'react-native';
import {VStack, View, ScrollView, Text} from 'native-base';
import Toast from 'react-native-toast-message';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {EmpaPlainBtn} from '../../components/EmpaPlainBtn';

export const SubMenus = props => {
  const id = props.route.params.id;
  const title = props.route.params.title;

  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [subjectTitle, setSubjectTitle] = useState('');
  const [space, setSpace] = useState('0');

  const screenInfo = {
    title: title,
    subTitle: '',
    header: '2',
    footer: '1',
  };

  useEffect(() => {
    setLoading(true);
    getSubCategoryMenus();
    if (id === 2) {
      setSubjectTitle('How do you feel?');
      setSpace(4);
    } else if (id === 5) {
      setSubjectTitle('Choose A Journey To Explore');
      setSpace(6);
    } else if (id === 6) {
      setSubjectTitle('');
      setSpace(4);
    }
  }, [id]);

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
        setMenus([]);
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

  const onEmpaPlainBtnPress = menu => {
    if (menu.cat_id === 5) {
      props.navigation.navigate('content_self_inquiry', {
        menu: JSON.stringify(menu),
      });
    } else {
      props.navigation.navigate('content', {menu: JSON.stringify(menu)});
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
          <View zIndex={1} style={{marginTop: height * 0.07}}>
            {subjectTitle && (
              <Text
                color="light.50"
                fontFamily="CenturyGothic"
                fontSize="xl"
                textAlign="center"
                mb="3">
                {subjectTitle}
              </Text>
            )}
            <ScrollView style={{height: height * 0.55}}>
              <VStack space={space} pb="6">
                {menus.map(menu => (
                  <EmpaPlainBtn
                    title={menu.title}
                    key={menu.id}
                    onBtnPress={() => onEmpaPlainBtnPress(menu)}
                    ht={40}
                    textMT={-9}
                  />
                ))}
              </VStack>
            </ScrollView>
          </View>
        )}
      </Layout>
    </>
  );
};
