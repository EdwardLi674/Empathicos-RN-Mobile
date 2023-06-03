import React, {useEffect, useState} from 'react';
import {useWindowDimensions, ActivityIndicator} from 'react-native';
import {ScrollView, Center, View, Text, Button} from 'native-base';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {Layout} from '../../components/Layout';
import {baseUrl} from '../../utils/util';
import {useUser} from '../../context/User';
import {ConfirmDialog} from '../../components/ConfirmDialog';

export const ListMyJournals = () => {
  const isFocused = useIsFocused();

  const {height} = useWindowDimensions();
  const {userData} = useUser();

  const screenInfo = {
    title: 'My Journals',
    subTitle: '',
    header: '2',
    footer: '1',
  };

  const [loading, setLoading] = useState(true);
  const [journalLoading, setJournalLoading] = useState(false);
  const [journals, setJournals] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    getJournals();
  }, [isFocused]);

  const getJournals = async () => {
    const token = userData.access_token;
    const url = `${baseUrl}/journal/list`;
    var options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const result = await fetch(url, options);
      const resResult = await result.json();
      if (!resResult.status) {
        Toast.show({
          type: 'error',
          text1: resResult.message,
        });
      } else {
        if (resResult.results) setJournals(resResult.results);
      }
      setLoading(false);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network not working',
      });
    }
  };

  const onJournalDelete = journal_id => {
    setTargetId(journal_id);
    setIsOpenDialog(true);
  };

  const onCloseDialog = async selected => {
    setIsOpenDialog(false);

    if (selected === 'ok') {
      const token = userData.access_token;
      const url = `${baseUrl}/journal/delete/${targetId}`;
      var options = {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      };
      try {
        setJournalLoading(true);
        const result = await fetch(url, options);
        const resResult = await result.json();
        if (!resResult.status) {
          Toast.show({
            type: 'error',
            text1: resResult.message,
          });
        } else {
          const newJournals = journals.filter(
            journal => journal.id !== targetId,
          );
          setJournals(newJournals);
        }
        setJournalLoading(false);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Network not working',
        });
      }
    }
  };

  return (
    <Layout screenInfo={screenInfo} bgIdx="5">
      {loading ? (
        <ActivityIndicator
          color="#fff"
          size="large"
          style={{marginTop: '50%'}}
        />
      ) : (
        <ScrollView style={{height: height * 0.7}} mt={height * 0.07}>
          <Center pb="32">
            {journals.map(journal => (
              <View key={journal.id} w="85%" mb="4">
                <ScrollView
                  height="40"
                  py="2"
                  px="3"
                  bg="white"
                  opacity="0.9"
                  nestedScrollEnabled={true}>
                  <Text
                    textAlign="center"
                    fontFamily="CenturyGothic"
                    bold
                    fontSize="18">
                    {journal.title}
                  </Text>
                  <Text fontFamily="CenturyGothic" fontSize="16" pb="3">
                    {journal.description}
                  </Text>
                </ScrollView>
                <Button
                  bg="#133a6c"
                  py="1"
                  mt="2"
                  w="1/3"
                  isLoading={
                    targetId === journal.id && journalLoading ? true : false
                  }
                  isLoadingText="Deleting"
                  borderRadius="2xl"
                  alignSelf="flex-end"
                  onPress={() => onJournalDelete(journal.id)}
                  _text={{fontSize: 18, fontFamily: 'CenturyGothic'}}>
                  Delete
                </Button>
              </View>
            ))}
          </Center>
        </ScrollView>
      )}
      <ConfirmDialog
        isOpen={isOpenDialog}
        onClosed={onCloseDialog}
        title="Delete"
        content="Are you sure to remove the current journal from your account?"
      />
    </Layout>
  );
};
