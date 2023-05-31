import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {Image, useWindowDimensions, ActivityIndicator} from 'react-native';
import {Center, View, ScrollView, Text} from 'native-base';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {Accordion} from '../../components/Accordion';

export const FAQ = props => {
  const screenInfo = {
    title: 'FAQs',
    subTitle: '',
    header: '2',
    footer: '0',
  };
  const {height, width} = useWindowDimensions();

  const {userData} = useUser();

  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    getFAQs();
  }, []);

  const getFAQs = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/faqs`;
    var options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const result = await fetch(url, options);
      const resResult = await result.json();
      setLoading(false);
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      } else {
        const faqList = resResult.results;
        const newFaqs = faqList.map(faqItem => ({...faqItem, expanded: false}));
        setFaqs(newFaqs);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onItemPress = faq_id => {
    console.log(faq_id);
    const newFaqs = faqs.map(faq =>
      faq.id === faq_id ? {...faq, expanded: !faq.expanded} : faq,
    );
    setFaqs(newFaqs);
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
          <Center mt={height * 0.07}>
            <View w={width * 0.9} maxH={height * 0.52}>
              <ScrollView>
                {faqs.map(faq => (
                  <Accordion
                    key={faq.id}
                    data={faq}
                    onPressed={faq_id => onItemPress(faq_id)}
                  />
                ))}
              </ScrollView>
            </View>
          </Center>
        )}
      </Layout>
    </>
  );
};
