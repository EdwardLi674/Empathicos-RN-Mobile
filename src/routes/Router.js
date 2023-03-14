import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useUser} from '../context/User';
import {AuthStack} from './AuthStack';
import {NoAuthStack} from './NoAuthStack';

export const Router = () => {
  const {userData} = useUser();

  return (
    <NavigationContainer>
      {userData && userData.access_token ? <AuthStack /> : <NoAuthStack />}
    </NavigationContainer>
  );
};
