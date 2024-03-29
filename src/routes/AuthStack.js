import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {Home} from '../screens/Home';
import {Profile} from '../screens/user/Profile';
import {ListMyJournals} from '../screens/user/ListMyJournals';
import {ListSelfInquiries} from '../screens/user/ListSelfInquiries';
import {Invite} from '../screens/user/Invite';
import {Favorite} from '../screens/user/Favorite';
import {Journey} from '../screens/journey/Journey';
import {JourneyDetail} from '../screens/journey/JourneyDetail';
import {JourneyGo} from '../screens/journey/JourneyGo';
import {SoulVision} from '../screens/soulvision/Main';
import {AudioCourses} from '../screens/soulvision/AudioCourses';
import {AudioCourse} from '../screens/soulvision/AudioCourse';
import {Journeys} from '../screens/soulvision/Journeys';
import {JourneyTemplate} from '../screens/soulvision/JourneyTemplate';
import {SubMenus} from '../screens/global/SubMenus';
import {About} from '../screens/global/About';
import {Feedback} from '../screens/global/Feedback';
import {FAQ} from '../screens/global/FAQ';
import {Content} from '../screens/global/Content';
import {ContentPersonalMessage} from '../screens/global/ContentPersonalMessage';
import {ContentMeetAna} from '../screens/global/ContentMeetAna';
import {ContentSelfInquiry} from '../screens/global/ContentSelfInquiry';
import {MagicDoorIntroductory} from '../screens/magicdoor/Introductory';
import {MagicDoorMenus} from '../screens/magicdoor/MainMenu';
import {MiniCourse} from '../screens/magicdoor/MiniCourse';
import {MyJournal} from '../screens/magicdoor/MyJournal';
import {AskAna} from '../screens/global/AskAna';
import {Shop} from '../screens/visitshop/Shop';
import {Product} from '../screens/visitshop/Product';
import {Cart} from '../screens/visitshop/Cart';
import {Order} from '../screens/visitshop/Order';
import {BuyProduct} from '../screens/visitshop/BuyProduct';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import Share from 'react-native-share';
import {Linking} from 'react-native';
import {useUser} from '../context/User';
import {baseUrl} from '../utils/util';
import Toast from 'react-native-toast-message';

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
  const {userData} = useUser();

  const [aboutInfos, setAboutInfos] = useState([]);

  useEffect(() => {
    getAboutInfos();
  }, []);

  const getAboutInfos = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/abouts`;
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
        const aboutInfos = resResult.results;
        setAboutInfos(aboutInfos);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onAboutMenuPress = aboutInfo => {
    props.navigation.navigate('about', {about: aboutInfo});
  };

  const onSharePress = () => {
    let options = {
      title: 'Empathicos',
      message: 'Save time and use this app in a short time',
      url: 'https://google.com',
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  const onDevelopedByPress = () => {
    let url = 'https://creativelab.tv/';
    Linking.openURL(url)
      .then(data => {
        console.log('Developed by creativelab');
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Can't open the corresponding website.",
        });
      });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Shop"
        onPress={() => props.navigation.navigate('visit_shop')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
      <DrawerItem
        label="Share Empathicos"
        onPress={onSharePress}
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
      {aboutInfos.map(about => (
        <DrawerItem
          key={about.id}
          label={`About ${about.name}`}
          onPress={() => onAboutMenuPress(about)}
          inactiveTintColor="white"
          labelStyle={{
            fontFamily: 'CenturyGothic',
            fontSize: 17,
            fontWeight: 'normal',
          }}
        />
      ))}
      {/*
      <DrawerItem
        label="About Alesha"
        onPress={() => props.navigation.navigate('about', {title: 'alesha'})}
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
      <DrawerItem
        label="About Paul Wagner"
        onPress={() =>
          props.navigation.navigate('about', {title: 'paul wagner'})
        }
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
      <DrawerItem
        label="About The Artist"
        onPress={() => props.navigation.navigate('about', {title: 'artist'})}
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      /> */}
      <DrawerItem
        label="Send Feedback"
        onPress={() => props.navigation.navigate('feedback')}
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
      <DrawerItem
        label="FAQ"
        onPress={() => props.navigation.navigate('faq')}
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
      <DrawerItem
        label="Developed By"
        onPress={onDevelopedByPress}
        inactiveTintColor="white"
        labelStyle={{
          fontFamily: 'CenturyGothic',
          fontSize: 17,
          fontWeight: 'normal',
        }}
      />
    </DrawerContentScrollView>
  );
};

export const AuthStack = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="home"
      backBehavior="history"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#b24097',
        },
        swipeEnabled: false,
        drawerInactiveTintColor: 'white',
        drawerLabelStyle: {
          fontFamily: 'CenturyGothic',
          fontWeight: '700',
        },
      }}>
      <Drawer.Screen name="home" component={Home} />
      <Drawer.Screen
        name="profile"
        component={Profile}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="list_my_journals"
        component={ListMyJournals}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="list_self_inquiries"
        component={ListSelfInquiries}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="invite"
        component={Invite}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="journey"
        component={Journey}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="journey_detail"
        component={JourneyDetail}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="journey_go"
        component={JourneyGo}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="favorite"
        component={Favorite}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="soul_vision"
        component={SoulVision}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="audio_courses"
        component={AudioCourses}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="audio_course"
        component={AudioCourse}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="journeys"
        component={Journeys}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="journey_template"
        component={JourneyTemplate}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="sub_menus"
        component={SubMenus}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="content"
        component={Content}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="content_personal_message"
        component={ContentPersonalMessage}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="content_meet_ana"
        component={ContentMeetAna}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="content_self_inquiry"
        component={ContentSelfInquiry}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="magic_door"
        component={MagicDoorIntroductory}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="magic_door_menus"
        component={MagicDoorMenus}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="mini_course"
        component={MiniCourse}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="my_journal"
        component={MyJournal}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="ask_ana"
        component={AskAna}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="visit_shop"
        component={Shop}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="product"
        component={Product}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="cart"
        component={Cart}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="buy_product"
        component={BuyProduct}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="order"
        component={Order}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="about"
        component={About}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="feedback"
        component={Feedback}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="faq"
        component={FAQ}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
    </Drawer.Navigator>
  );
};
