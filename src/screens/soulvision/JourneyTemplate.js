import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {View, HStack, Button, Icon} from 'native-base';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {Template} from './components/Template';

export const JourneyTemplate = props => {
  const id = props.route.params.id;
  const title = props.route.params.title;
  const isFocused = useIsFocused();

  const scrollViewRef = useRef(null);
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [screenInfo, setScreenInfo] = useState({
    title: '',
    subTitle: '',
    header: '3',
    footer: '2',
  });
  const [loading, setLoading] = useState(true);
  const [screenIndex, setScreenIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [nextBtnDisable, setNextBtnDisable] = useState(false);
  const [backBtnDisable, setBackBtnDisable] = useState(true);

  useEffect(() => {
    setLoading(true);
    setScreenIndex(0);
    setNextBtnDisable(false);
    setBackBtnDisable(true);
    getTemplates();
  }, [id]);

  const getTemplates = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/journey/${id}`;
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
        const templatelist = resResult.results;
        console.log(templatelist[0]);
        setTemplates(templatelist);

        setScreenInfo({
          ...screenInfo,
          title: title,
          subTitle: templatelist[0].value.title,
        });
        if (templatelist.length === 1) {
          setNextBtnDisable(true);
        }
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

  const onFlipScroll = event => {
    const xVal = event.nativeEvent.contentOffset.x;
    const newScreenIndex = Math.round(xVal / width);
    // flip to the right
    if (newScreenIndex > screenIndex) {
      onNextScrollValidate(newScreenIndex);
    } else {
      onBackScrollValidate(newScreenIndex);
    }
    onScreenUpdate(newScreenIndex);
  };

  const onNextScrollValidate = async screenIdx => {
    // validation if next course exist
    if (screenIdx >= templates.length - 1) {
      setNextBtnDisable(true);
    }
    setBackBtnDisable(false);
  };

  const onBackScrollValidate = async screenIdx => {
    // validation if next course exist
    if (screenIdx < 1) {
      setBackBtnDisable(true);
    }
    setNextBtnDisable(false);
  };

  const onScreenUpdate = async screenIdx => {
    // upgrade the screen information on header
    setScreenInfo({
      ...screenInfo,
      subTitle: templates[screenIdx].value.title,
    });

    setScreenIndex(screenIdx);
  };

  const onNextBtnPress = async () => {
    const newScreenIndex = screenIndex + 1;

    // trigger the screen horizontal scroll
    scrollViewRef.current?.scrollTo({
      x: width * newScreenIndex,
      animated: true,
    });

    onNextScrollValidate(newScreenIndex);
    onScreenUpdate(newScreenIndex);
  };

  const onBackBtnPress = async () => {
    const newScreenIndex = screenIndex - 1;

    // trigger the screen horizontal scroll
    scrollViewRef.current?.scrollTo({
      x: width * newScreenIndex,
      animated: true,
    });

    onBackScrollValidate(newScreenIndex);
    onScreenUpdate(newScreenIndex);
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
          <View>
            <Animated.ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScrollEndDrag={event => onFlipScroll(event)}>
              {templates.map(template => (
                <Template
                  key={template.id}
                  selectedIdx={screenIndex}
                  image={template.value.image}
                  description={template.value.description}
                />
              ))}
            </Animated.ScrollView>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              mx="12"
              mt="4">
              <Button
                py="1"
                bg="#a73d96"
                isDisabled={backBtnDisable}
                onPress={onBackBtnPress}
                leftIcon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="chevron-left"
                    size="md"
                  />
                }>
                Back
              </Button>
              <Button
                py="1"
                bg="#a73d96"
                isDisabled={nextBtnDisable}
                onPress={onNextBtnPress}
                rightIcon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="chevron-right"
                    size="md"
                  />
                }>
                Next
              </Button>
            </HStack>
          </View>
        )}
      </Layout>
    </>
  );
};
