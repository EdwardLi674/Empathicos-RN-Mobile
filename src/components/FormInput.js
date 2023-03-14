import React, {useState, useEffect, useRef} from 'react';
import {Keyboard} from 'react-native';
import {FormControl, Text, Input, WarningOutlineIcon} from 'native-base';

export const FormInput = props => {
  const {label, mt, isRequired, isReadOnly, errMsg, value, onChange} = props;

  const localInputRef = useRef();

  const inputType =
    label === 'Password' || label === 'Confirm Password' ? 'password' : 'text';
  const isInvalid = errMsg ? true : false;

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
    <FormControl
      mt={mt}
      isRequired={isRequired}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}>
      <FormControl.Label
        _text={{color: 'white', fontFamily: 'CenturyGothic', fontSize: 16}}>
        {label}
      </FormControl.Label>
      <Input
        ref={ref => {
          localInputRef && (localInputRef.current = ref);
        }}
        w="100%"
        color="white"
        fontSize="16"
        type={inputType}
        focusOutlineColor="white"
        value={value}
        onChangeText={onChange}
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errMsg}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};
