import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {Home} from '../screens/Home';
import {Profile} from '../screens/user/Profile';
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
import {Content} from '../screens/global/Content';
import {ContentPersonalMessage} from '../screens/global/ContentPersonalMessage';
import {ContentSelfInquiry} from '../screens/global/ContentSelfInquiry';
import {EnterMagicDoor} from '../screens/magicdoor/Main';
import {MiniCourse} from '../screens/magicdoor/MiniCourse';
import {MyJournal} from '../screens/magicdoor/MyJournal';
import {AskAna} from '../screens/global/AskAna';
import {Shop} from '../screens/visitshop/Shop';
import {Product} from '../screens/visitshop/Product';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Shop"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="Share Empathicos"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="Blended Soul"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="About Empathicos"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="About Alesha"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="About Paul Wagner"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="About The Artist"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="Send Feedback"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="FAQ"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
      />
      <DrawerItem
        label="Developed By"
        onPress={() => console.log('Help')}
        inactiveTintColor="white"
        fontFamily="CenturyGothic"
        fontWeight="700"
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
        name="content_self_inquiry"
        component={ContentSelfInquiry}
        options={{
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Drawer.Screen
        name="magic_door"
        component={EnterMagicDoor}
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
    </Drawer.Navigator>
  );
};
