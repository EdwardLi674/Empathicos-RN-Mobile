import React, {useEffect, useState, useRef} from 'react';
import {useWindowDimensions, StyleSheet, Keyboard} from 'react-native';
import {View, Center, Text, TextArea, Button, HStack} from 'native-base';
import RenderHtml from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import {useUser} from '../../../context/User';
import {baseUrl} from '../../../utils/util';

export const Topic = props => {
  const {id, title, description, islast} = props;

  const {height, width} = useWindowDimensions();
  const {userData} = useUser();
  const localInputRef = useRef();

  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveBtnDisable, setSaveBtnDisable] = useState(true);
  const [cancelBtnDisable, setCancelBtnDisable] = useState(true);

  useEffect(() => {
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHideCallback,
    );

    return () => {
      keyboardDidHideSubscription?.remove();
    };
  }, []);

  const keyboardDidHideCallback = () => {
    localInputRef.current.blur?.();
  };

  const onCancelPress = () => {
    setSaveBtnDisable(true);
    setCancelBtnDisable(true);
    setEntry('');
  };

  const onSavePress = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/topics/entry/save`;
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        topic_id: id,
        entry_text: entry,
        user_id: userData.user.id,
      }),
    };
    setLoading(true);
    try {
      const result = await fetch(url, options);
      const resResult = await result.json();
      setLoading(false);
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: resResult.message,
        });
        setEntry('');
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onEntryChange = txt => {
    setEntry(txt);
    if (txt) {
      setSaveBtnDisable(false);
      setCancelBtnDisable(false);
    } else {
      setSaveBtnDisable(true);
      setCancelBtnDisable(true);
    }
  };

  return (
    <Center mt="4" style={islast ? styles.last : styles.nolast}>
      <View
        bg="white"
        px="2"
        pt="1"
        opacity="0.8"
        style={{width: width * 0.85}}>
        <Text bold fontFamily="CenturyGothic" fontSize="md" textAlign="center">
          {title}
        </Text>
        <RenderHtml contentWidth={width} source={{html: description}} />
      </View>
      <View bg="white" style={{width: width * 0.85}} opacity="0.8" mt="2">
        <TextArea
          ref={ref => {
            localInputRef && (localInputRef.current = ref);
          }}
          focusOutlineColor="white"
          numberOfLines={3}
          fontFamily="CenturyGothic"
          fontSize="12"
          value={entry}
          onChangeText={txt => onEntryChange(txt)}
        />
      </View>
      <HStack
        alignItems="space-between"
        justifyContent="space-between"
        flexDirection="row"
        style={{width: width * 0.85}}
        space="10"
        mt="2">
        <Button
          bg="#133a6c"
          px="8"
          py="1"
          borderRadius="2xl"
          isDisabled={saveBtnDisable}
          isLoading={loading}
          isLoadingText="Save"
          onPress={onSavePress}
          _text={{fontSize: 18, fontFamily: 'CenturyGothic'}}>
          Save
        </Button>
        <Button
          bg="#133a6c"
          px="4"
          py="1"
          borderRadius="2xl"
          isDisabled={cancelBtnDisable}
          onPress={onCancelPress}
          _text={{fontSize: 18, fontFamily: 'CenturyGothic'}}>
          Cancel
        </Button>
      </HStack>
    </Center>
  );
};

const styles = StyleSheet.create({
  last: {
    marginBottom: 60,
  },
  nolast: {
    marginBottom: 0,
  },
});
