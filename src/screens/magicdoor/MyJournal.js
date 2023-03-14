import React, {useState, useEffect, useRef} from 'react';
import {useWindowDimensions, Keyboard} from 'react-native';
import {
  View,
  VStack,
  HStack,
  Icon,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from 'native-base';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {PlainBtn} from '../../components/PlainBtn';
import {PlainInput} from '../../components/PlainInput';
import {PlainTextArea} from '../../components/PlainTextArea';

export const MyJournal = props => {
  const {height, width} = useWindowDimensions();
  const {userData} = useUser();

  const screenInfo = {
    title: 'My Journal',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [journalID, setJournalID] = useState('');

  useEffect(() => {
    const keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHideCallback,
    );

    const keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShowCallback,
    );

    return () => {
      keyboardDidHideSubscription?.remove();
      keyboardDidShowSubscription?.remove();
    };
  }, []);

  const keyboardDidHideCallback = () => {
    setHideFooter(false);
  };

  const keyboardDidShowCallback = () => {
    setHideFooter(true);
  };

  const onJounalChange = txt => {
    setDescription(txt);

    if (txt && title) setIsDisable(false);
    else setIsDisable(true);
  };

  const onTitleChange = txt => {
    setTitle(txt);
    if (txt && description) setIsDisable(false);
    else setIsDisable(true);
  };

  const onJournalSave = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/journal/save`;
    const data = {
      title: title,
      description: description,
      user_id: userData.user.id,
    };

    if (journalID) {
      data.id = journalID;
    }

    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
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
        setJournalID(resResult.results.id);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onAddJourneyPress = () => {
    setJournalID('');
    setTitle('');
    setDescription('');
  };

  return (
    <Layout screenInfo={screenInfo} bgIdx="6" hideFooter={hideFooter}>
      <KeyboardAvoidingView
        zIndex={1}
        // pb="4"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{marginTop: height * 0.05}}>
          <VStack space={3} alignItems="center" px="6">
            <Text
              fontSize="md"
              fontFamily="CenturyGothic"
              color="white"
              textAlign="center">
              Journaling helps us commune with our deeper selves and discover.
              Enjoy the prompts below or come up with new ones!
            </Text>
            <Text
              fontSize="xl"
              fontFamily="CenturyGothic"
              color="white"
              textAlign="center">
              I am thankful... I love...
            </Text>
            <Text
              mt="-3"
              fontSize="xl"
              fontFamily="CenturyGothic"
              color="white"
              textAlign="center">
              I dream... I feel... I know...
            </Text>
            <View bg="white" style={{width: width * 0.85}} opacity="0.8">
              <PlainInput
                placeholder="Title"
                value={title}
                onChange={onTitleChange}
              />
              <PlainTextArea
                placeholder="Description"
                value={description}
                onChange={txt => onJounalChange(txt)}
              />
            </View>
            <HStack alignItems="center">
              <PlainBtn
                loading={loading}
                isDisable={isDisable}
                onPress={onJournalSave}
                btnLabel="Save"
              />
              <Pressable px="3" borderRadius="50" onPress={onAddJourneyPress}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="plus-thick"
                  color="amber.400"
                  size={8}
                />
              </Pressable>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};
