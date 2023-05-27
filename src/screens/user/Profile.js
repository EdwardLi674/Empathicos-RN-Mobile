import React, {useState, useEffect} from 'react';
import {Image, useWindowDimensions, StyleSheet} from 'react-native';
import {
  Center,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUser} from '../../context/User';
import {Layout} from '../../components/Layout';
import {FormBtn} from '../../components/FormBtn';
import {FormInput} from '../../components/FormInput';
import {FormTextArea} from '../../components/FormTextArea';
import {baseUrl} from '../../utils/util';

export const Profile = () => {
  const screenInfo = {
    title: 'Profile',
    subTitle: '',
    header: '1',
    footer: '0',
  };

  const {height, width} = useWindowDimensions();

  const {userData, onUser} = useUser();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(userData.user.email);
  const [emailErr, setEmailErr] = useState('');
  const [name, setName] = useState(userData.user?.name);
  const [birthday, setBirthday] = useState(new Date());
  const [birthdayStr, setBirthdayStr] = useState(userData.user?.birthday);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [about, setAbout] = useState(userData.user?.about);
  const [photo, setPhoto] = useState(null);
  const [photoUri, setPhotoUri] = useState(userData.user?.image);

  const profileImage = photoUri ? (
    <Image
      source={{
        uri: photoUri,
      }}
      style={{
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: 40,
      }}
    />
  ) : (
    <Image
      source={require('../../assets/imgs/icon_profile.png')}
      style={{width: width * 0.2, height: width * 0.2}}
    />
  );

  const onProfileSave = async () => {
    if (!email) {
      setEmailErr('Email is required.');
      return;
    } else {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(email) === false) {
        setEmailErr('Email is incorrect.');
        return;
      }
    }

    const token = userData.access_token;
    const url = `${baseUrl}/profile`;
    const bodyData = {
      name,
      email,
      birthday: format(birthday, 'yyyy-MM-dd'),
      about,
    };
    var options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: createFormData(photo, bodyData),
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
        onUser(resResult.results);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const createFormData = (photo, body = {}) => {
    const data = new FormData();

    if (photo) {
      data.append('image', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  const onBirthdayChange = (event, selectedDate) => {
    const birthdayStr = format(selectedDate, 'MMMM dd, yyyy');
    setIsShowDatePicker(false);
    setBirthday(selectedDate);
    if (event.type === 'set') {
      setBirthdayStr(birthdayStr);
    }
  };

  const onEmailChanged = txt => {
    setEmailErr('');
    setEmail(txt);
  };

  const onChoosePhoto = async () => {
    await launchImageLibrary({noData: true}, response => {
      if (response.assets) {
        setPhoto(response.assets[0]);
        if (response.assets) setPhotoUri(response.assets[0].uri);
      }
    });
  };

  return (
    <>
      <Layout screenInfo={screenInfo}>
        <KeyboardAvoidingView
          w={width * 0.9}
          h={height * 0.53}
          ml="6"
          mt={height * 0.07}
          bg="primary.600"
          borderColor="amber.300"
          borderWidth="2"
          borderRadius="md"
          zIndex={1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView px="6" pt="2">
            <Center>
              <Pressable onPress={onChoosePhoto}>{profileImage}</Pressable>
              <FormInput
                mt="0"
                label="Name"
                value={name}
                onChange={txt => setName(txt)}
              />
              <FormInput
                mt="2"
                label="Email"
                isRequired={true}
                errMsg={emailErr}
                value={email}
                onChange={txt => onEmailChanged(txt)}
              />
              <Pressable mt="2" onPress={() => setIsShowDatePicker(true)}>
                <FormInput
                  label="Birthday"
                  value={birthdayStr}
                  isReadOnly={true}
                />
              </Pressable>
              {isShowDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={birthday}
                  mode="date"
                  onChange={onBirthdayChange}
                />
              )}
              <FormTextArea
                mt="2"
                label="About me"
                value={about}
                onChange={txt => setAbout(txt)}
              />
              <View my="4">
                <FormBtn
                  title="Save"
                  onBtnPress={onProfileSave}
                  loading={loading}
                />
              </View>
            </Center>
          </ScrollView>
        </KeyboardAvoidingView>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: 'CenturyGothic',
    color: '#fff',
  },
});
