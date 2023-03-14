import React, {useState, useEffect, useRef} from 'react';
import {Keyboard} from 'react-native';
import {
  FormControl,
  Text,
  Input,
  WarningOutlineIcon,
  TextArea,
} from 'native-base';

export const FormTextArea = props => {
  const {label, mt, value, onChange} = props;

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
    <FormControl mt={mt}>
      <Text color="light.50" fontFamily="CenturyGothic" fontSize="md">
        {label}
      </Text>
      <TextArea
        ref={ref => {
          localInputRef && (localInputRef.current = ref);
        }}
        focusOutlineColor="light.50"
        numberOfLines={4}
        color="white"
        fontFamily="CenturyGothic"
        fontSize="16"
        value={value}
        onChangeText={onChange}
      />
    </FormControl>
  );
};
