import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, View, Text} from 'native-base';
import RenderHtml from 'react-native-render-html';

export const Accordion = props => {
  const {data, onPressed} = props;

  const {height, width} = useWindowDimensions();

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPressed(data.id);
  };

  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={toggleExpand}>
        <Text color="white" fontSize="16" fontFamily="CenturyGothic">
          {data.question}
        </Text>
        <Icon
          as={MaterialCommunityIcons}
          name={data.expanded ? 'chevron-down' : 'chevron-up'}
          color="white"
          size={6}
        />
      </TouchableOpacity>
      <View bg="#0091b2" pt="1" px="4">
        {data.expanded && (
          <RenderHtml
            contentWidth={width}
            source={{html: data.anwser}}
            tagsStyles={{
              p: {
                marginTop: '2px',
                fontFamily: 'CenturyGothic',
                color: 'white',
                fontSize: 16,
              },
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: 'CenturyGothic',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 15,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: '#a83285',
  },
  parentHr: {
    height: 1,
    color: 'white',
    width: '100%',
  },
});
