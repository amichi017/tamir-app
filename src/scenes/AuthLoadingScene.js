import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spinner } from 'native-base';
import { initNativeFirebase, firebase } from '../utils/firebase/firebase-db';

class AuthLoadingScene extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-console
    console.disableYellowBox = true;
    initNativeFirebase().then(() => {
      const user = firebase.auth().currentUser;
      if (user) {
        props.navigation.navigate('MainScene');
      } else {
        props.navigation.navigate('PhoneInputScene');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export { AuthLoadingScene };
