import React, {useEffect, useRef} from 'react';
import {Keyboard} from 'react-native';
import {Input} from 'native-base';

export const PlainInput = props => {
  const {value, onChange, borderColor, borderRadius, placeholder} = props;

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
    <Input
      ref={ref => {
        localInputRef && (localInputRef.current = ref);
      }}
      borderColor={borderColor}
      borderWidth="1"
      borderRadius={borderRadius}
      fontFamily="CenturyGothic"
      fontSize="14"
      placeholder={placeholder}
      placeholderTextColor="gray.500"
      value={value}
      onChangeText={onChange}
    />
  );
};
