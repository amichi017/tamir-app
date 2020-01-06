import React from 'react';
import { Container, Content, Input, Label, Form, Item, Button, Spinner, Text } from 'native-base';
import { Alert } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { firebase } from '../utils/firebase/firebase-db';

class SmsCodeConfirmScene extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      loading: false,
      code: '',
      textinput: ''
    };
  }

  componentDidMount() {
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('MainScene');
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleInputChange = textinput => {
    this.setState({
      textinput
    });
  };

  render() {
    const disabled = !(this.state.textinput.length > 5);
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Confirmation code</Label>
              <Input
                autoFocus
                onChangeText={this.handleInputChange}
                value={this.state.textinput}
                keyboardType="numeric"
                maxLength={6}
              />
            </Item>
            <Button
              disabled={disabled}
              color="secondary"
              style={[
                !(this.state.textinput.length > 5) ? styles.buttontwoStyles : styles.buttonOneStyle,
                { alignSelf: 'center', marginTop: 40 }
              ]}
              onPress={() => {
                this.setState({ loading: true });
                const { confirmResult } = this.props.navigation.state.params;
                confirmResult
                  .confirm(this.state.code)
                  .then(user => {
                    this.setState({ loading: false });
                    if (user) this.props.navigation.navigate('MainScene');
                    else Alert.alert('Wrong code entered!');
                  })
                  .catch(err => {
                    this.setState({ loading: false });
                    Alert.alert('Wrong code entered!: ', err.message);
                  });
              }}>
              {this.state.loading ? <Spinner /> : <Text style={styles.textStyle}>Confirm</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonOneStyle: {
    width: 120,
    justifyContent: 'center',
    backgroundColor: '#007aff'
  },

  buttontwoStyle: {
    width: 120,
    justifyContent: 'center',
    backgroundColor: '##d7d7d7'
  }
};
export { SmsCodeConfirmScene };
