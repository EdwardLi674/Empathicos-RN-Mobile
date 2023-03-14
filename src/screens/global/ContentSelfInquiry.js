import React, {useEffect, useState} from 'react';
import {
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {ScrollView, KeyboardAvoidingView} from 'native-base';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Topic} from './components/Topic';

export const ContentSelfInquiry = props => {
  const menu = props.route.params.menu;
  const menuObj = JSON.parse(menu);
  const isFocused = useIsFocused();

  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [bgIdx, setBgIdx] = useState('');

  const screenInfo = {
    title: menuObj.title,
    subTitle: '',
    header: '2',
    footer: '1',
  };

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideFooter, setHideFooter] = useState(false);

  useEffect(() => {
    switch (menuObj.id) {
      case 12:
        setBgIdx('1');
        break;
      case 13:
        setBgIdx('2');
        break;
      case 14:
        setBgIdx('3');
        break;
      case 15:
        setBgIdx('4');
        break;
      case 16:
        setBgIdx('5');
        break;
      default:
        break;
    }

    setLoading(true);
    getTopics();

    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHideCallback,
    );

    const keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShowCallback,
    );

    return () => {
      keyboardDidHideSubscription?.remove();
      keyboardDidShowSubscription?.remove();
    };
  }, [isFocused]);

  const keyboardDidHideCallback = () => {
    setHideFooter(false);
  };

  const keyboardDidShowCallback = () => {
    setHideFooter(true);
  };

  const getTopics = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/topics/${menuObj.id}`;
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
        setTopics([]);
      } else {
        setTopics(resResult.results);
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
    <Layout screenInfo={screenInfo} bgIdx={bgIdx} hideFooter={hideFooter}>
      {loading ? (
        <ActivityIndicator
          color="#fff"
          size="large"
          style={{marginTop: '50%'}}
        />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView style={{height: height * 0.65}} mt="9">
            {topics.map((topic, idx) =>
              idx === topics.length - 1 ? (
                <Topic
                  key={topic.id}
                  title={topic.title}
                  description={topic.description}
                  id={topic.id}
                  islast={true}
                />
              ) : (
                <Topic
                  key={topic.id}
                  title={topic.title}
                  description={topic.description}
                  id={topic.id}
                  islast={false}
                />
              ),
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Layout>
  );
};
