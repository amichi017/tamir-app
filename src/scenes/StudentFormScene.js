import React from 'react';
import { Button, View } from 'react-native';
import { Container, Content, Button as NBButton, Text } from 'native-base';
import t from 'tcomb-form-native';
import { Student, options } from '../utils/student/constants';
import { stylesheet } from '../utils/student/formstyle';
import { firebase, updateDoc, setStudentStatus } from '../utils/firebase/firebase-db';
import { removeEmptyFields } from '../utils/general-utils';

const { Form } = t.form;
Form.stylesheet = stylesheet;

class StudentFormScene extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          onPress={navigation.state.params.onSave}
          title={navigation.state.params.actionType === 'newStudent' ? 'הוסף' : 'שמור'}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSave: this.onSave });
  }

  onSave() {
    const { actionType, student } = this.props.navigation.state.params;
    const currentStudent = this.formRef.getValue();

    if (currentStudent) {
      if (actionType === 'editStudent') {
        updateDoc('Students', student.studentUID, {
          ...removeEmptyFields(currentStudent),
          owners: {
            tutors: [
              {
                uid: firebase.auth().currentUser.uid,
                studentStatus: 'normal'
              }
            ]
          }
        });
      } else if (actionType === 'newStudent') {
        firebase
          .firestore()
          .collection('Students')
          .add({
            ...removeEmptyFields(currentStudent),
            owners: {
              tutors: [
                {
                  uid: firebase.auth().currentUser.uid,
                  studentStatus: 'normal'
                }
              ]
            }
          });
      }
      this.props.navigation.navigate('MainScene');
    }
  }

  render() {
    const { actionType, student } = this.props.navigation.state.params;
    return (
      <Container>
        <Content style={{ padding: 10 }}>
          <Form
            ref={ref => {
              this.formRef = ref;
            }}
            type={Student}
            value={actionType === 'newStudent' ? {} : student}
            options={options}
          />
          {actionType === 'editStudent' ? (
            <NBButton
              onPress={() => {
                setStudentStatus(student, 'normalDeleted');
                this.props.navigation.navigate('MainScene');
              }}
              danger
              style={{ alignSelf: 'flex-end' }}>
              <Text>מחק חניך</Text>
            </NBButton>
          ) : (
            <View />
          )}
          <View style={{ marginBottom: 50 }} />
        </Content>
      </Container>
    );
  }
}

export { StudentFormScene };
