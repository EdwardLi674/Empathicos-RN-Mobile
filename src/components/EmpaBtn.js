import React, {useState, useEffect} from 'react';
import {
  Pressable,
  Text,
  Center,
  WarningOutlineIcon,
  Modal,
  Button,
  ScrollView,
} from 'native-base';
import {StyleSheet, Image, useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';

export const EmpaBtn = props => {
  const {title, info, onBtnPress, ht, textMT, iconMT} = props;
  const {height, width} = useWindowDimensions();
  const regex = /(<([^>]+)>)/gi;

  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <Pressable alignItems="center" onPress={onBtnPress}>
        <Center>
          <Image
            source={require('../assets/imgs/rectangle_btn.png')}
            style={{width: 235, height: ht, resizeMode: 'stretch'}}
          />
          <Text fontSize="lg" color="white" style={styles.btn} mt={textMT}>
            {title}
          </Text>
          <WarningOutlineIcon
            color="amber.300"
            style={styles.warningIcon}
            mt={iconMT}
            onPress={() => setShowInfoModal(true)}
          />
        </Center>
      </Pressable>
      <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)}>
        <Modal.Content>
          <Modal.Body bg="#8b2c89">
            <Center>
              <Image
                source={require('../assets/imgs/icon_app.png')}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
              <Text
                color="white"
                fontFamily="CenturyGothic"
                fontSize="2xl"
                mt="2">
                {title}
              </Text>
              <ScrollView
                mt="2"
                style={{maxHeight: height * 0.35}}
                fontSize="md">
                <Text color="white" fontFamily="CenturyGothic" fontSize="md">
                  {info.replace(regex, '')}
                </Text>
                {/* <RenderHtml contentWidth={width} source={{html: info}} /> */}
              </ScrollView>
              <Button
                bg="#143c6d"
                borderColor="amber.400"
                borderWidth="2"
                borderRadius="4"
                mt="4"
                px="8"
                py="1"
                onPress={() => setShowInfoModal(false)}
                _text={{fontSize: 18}}>
                OK
              </Button>
            </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    fontFamily: 'CenturyGothic',
    textTransform: 'capitalize',
  },
  warningIcon: {
    marginRight: 10,
    alignSelf: 'flex-end',
  },
});
