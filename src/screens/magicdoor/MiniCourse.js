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
import {Course} from './components/Course';

export const MiniCourse = props => {
  const id = props.route.params.id;
  const title = props.route.params.title;

  const scrollViewRef = useRef(null);
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const [screenInfo, setScreenInfo] = useState({
    title: title,
    subTitle: '',
    header: '2',
    footer: '1',
  });
  const [loading, setLoading] = useState(true);
  const [screenIndex, setScreenIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [nextBtnDisable, setNextBtnDisable] = useState(false);
  const [backBtnDisable, setBackBtnDisable] = useState(true);

  useEffect(() => {
    setLoading(true);
    setScreenIndex(0);
    setNextBtnDisable(false);
    setBackBtnDisable(true);
    getCourses();
  }, [id]);

  const getCourses = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/mini-courses/${id}`;
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
        const courselist = resResult.results;
        setCourses(courselist);

        setScreenInfo({
          ...screenInfo,
          subTitle: courselist[0].title,
        });
        if (courselist.length === 1) {
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
    if (screenIdx >= courses.length - 1) {
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
      subTitle: courses[screenIdx].title,
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
              {courses.map(course => (
                <Course
                  key={course.id}
                  selectedIdx={screenIndex}
                  image={course.image}
                  description={course.description}
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
