import React, {useState, useEffect} from 'react';
import {HStack, Text, Menu, Icon} from 'native-base';
import {StyleSheet, View, Image, useWindowDimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const AvatarMenuItem = props => {
  const {title, icon, onItemPress} = props;

  return (
    <Menu.Item alignItems="flex-end" onPress={onItemPress}>
      <HStack space={2}>
        <Text color="white" style={styles.menu}>
          {title}
        </Text>
        <Icon as={MaterialCommunityIcons} name={icon} color="white" size={5} />
      </HStack>
    </Menu.Item>
  );
};

const styles = StyleSheet.create({
  menu: {
    fontSize: 18,
    fontFamily: 'CenturyGothic',
  },
});
