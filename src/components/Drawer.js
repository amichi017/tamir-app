import React from 'react';
import { Image, TouchableOpacity, Alert } from 'react-native';
import { Container, Text, Content } from 'native-base';
import { DrawerItems } from 'react-navigation';
import { firebase } from '../utils/firebase/firebase-db';
import { right } from '../utils/style-utils';

const Drawer = props => (
  <Container>
    <Content>
      <Image
        // eslint-disable-next-line global-require
        source={require('../../assets/images/tamir_logoshakuf.png')}
        style={{ width: 218, height: 113, alignSelf: 'center', marginTop: 100, marginBottom: 50 }}
      />
      <DrawerItems {...props} />

      <TouchableOpacity
        onPress={() =>
          firebase
            .auth()
            .signOut()
            .then(() => props.navigation.navigate('AuthLoadingScene'))
            .catch(err => {
              Alert.alert('Error Signing Out! : ', err.message);
            })
        }>
        <Text
          style={{
            fontFamily: 'Assistant-Bold',
            fontSize: 14,
            textAlign: right,
            paddingTop: 5,
            paddingRight: 17
          }}>
          יציאה מהמערכת
        </Text>
      </TouchableOpacity>
    </Content>
  </Container>
);

export { Drawer };
