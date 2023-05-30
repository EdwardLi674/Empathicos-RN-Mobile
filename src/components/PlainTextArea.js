import React, {useState, useEffect, useRef} from 'react';
import {Keyboard} from 'react-native';
import {
  FormControl,
  Text,
  Input,
  WarningOutlineIcon,
  TextArea,
} from 'native-base';

export const PlainTextArea = props => {
  const {
    value,
    onChange,
    borderColor,
    borderRadius,
    placeholder,
    height,
    textColor,
    placeholderColor,
  } = props;

  const localInputRef = useRef();

  const keyboardDidHideCallback = () => {
    localInputRef.current.blur?.();
  };

  useEffect(() => {
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHideCallback,
    );

    return () => {
      keyboardDidHideSubscription?.remove();
    };
  }, []);

  return (
    <TextArea
      ref={ref => {
        localInputRef && (localInputRef.current = ref);
      }}
      focusOutlineColor={borderColor}
      borderColor={borderColor}
      borderWidth="1"
      borderRadius={borderRadius}
      fontFamily="CenturyGothic"
      fontSize="14"
      numberOfLines={10}
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
      color={textColor}
      h={height}
      value={value}
      onChangeText={txt => onChange(txt)}
    />
  );
};
