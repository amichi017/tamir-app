import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Icon, Content, Container, Footer, Spinner } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import update from 'immutability-helper';
import { addToEndIfDoesntExistAtEnd } from '../utils/general-utils';
import { removeTime } from '../utils/date-utils';
import { firebase } from '../utils/firebase/firebase-db';
import { dbWithNoGroup } from '../utils/firebase/local-db';
import { ShiftEditor } from '../components';

const INITIAL_STATE = {
  activities: [],
  startTime: null,
  endTime: null,
  saveLoading: false
};
class AttendanceTabScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleStartTimePicked = this.handleStartTimePicked.bind(this);
    this.handleEndTimePicked = this.handleEndTimePicked.bind(this);
    this.onSave = this.onSave.bind(this);
    this.resetState = this.resetState.bind(this);
    this.style = [{}];
  }

  onSave() {
    const { startTime, endTime, activities } = this.state;
    const attendanceDays = this.props.db.AttendanceDays;
    if (Object.keys(attendanceDays).length !== 0) {
      // exists, therefore update
      const [attendanceDayUID, attendanceDay] = Object.keys(attendanceDays).map(key => [
        key,
        attendanceDays[key]
      ])[0];
      attendanceDay.shifts.push({ startTime, endTime, activities });
      this.setState({ saveLoading: true });
      firebase
        .firestore()
        .collection('AttendanceDays')
        .doc(attendanceDayUID)
        .set(attendanceDay, { merge: true })
        .then(() => {
          this.resetState();
        });
    } else {
      // create new
      const attendanceDay = {
        owners: { tutors: [firebase.auth().currentUser.uid] },
        day: removeTime(new Date()), // TODO
        shifts: [
          {
            startTime,
            endTime,
            activities
          }
        ]
      };
      this.setState({ saveLoading: true });
      firebase
        .firestore()
        .collection('AttendanceDays')
        .add(attendanceDay)
        .then(() => {
          this.resetState();
        });
    }
  }

  resetState() {
    this.setState(INITIAL_STATE);
    this.props.navigation.setParams({ actionType: undefined });
  }

  handleStartTimePicked(time) {
    this.setState({ startTime: time });
  }

  handleEndTimePicked(time) {
    this.setState({ endTime: time });
  }

  render() {
    const { navigation, db } = this.props;
    const dbWithNoGroupAdded = dbWithNoGroup(db);
    return (
      <Container style={{ padding: 10 }}>
        <Content>
          <View style={[styles.section, { marginBottom: 30 }]}>
            <Button
              style={styles.button}
              onPress={() =>
                navigation.navigate('AttendanceCalendarScene', { db: dbWithNoGroupAdded })
              }>
              <Icon name="calendar" />
              <Text style={{ color: '#ffffff', fontFamily: 'Assistant-Regular' }}>
                נוכחות קודמת
              </Text>
            </Button>
          </View>
          <ShiftEditor
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            activities={this.state.activities}
            onPressAddActivity={() =>
              navigation.navigate('ChooseActivityTypeScene', {
                db: dbWithNoGroupAdded,
                actionType: 'newActivity'
              })
            }
            onPressEditActivity={(
              { type, subtype, groups, student, comments },
              editedActivityIndex
            ) => {
              const actionType = 'editActivity';
              if (type === 'שיחה אישית')
                this.props.navigation.navigate('EditDiscussionDetailsScene', {
                  actionType,
                  editedActivityIndex,
                  student,
                  type,
                  subtype,
                  comments,
                  db: dbWithNoGroupAdded
                });
              else if (type === 'פעילות קבוצתית')
                this.props.navigation.navigate('GroupActivityDetailsScene', {
                  actionType,
                  editedActivityIndex,
                  type,
                  subtype,
                  comments,
                  groups
                });
            }}
            handleStartTimePicked={this.handleStartTimePicked}
            handleEndTimePicked={this.handleEndTimePicked}
          />
          <NavigationEvents
            onDidFocus={payload => {
              if (payload.state.params) {
                if (payload.state.params.actionType === 'newActivity')
                  this.setState(prevState => ({
                    activities: addToEndIfDoesntExistAtEnd(
                      payload.state.params.newActivity,
                      prevState.activities
                    )
                  }));
                else if (payload.state.params.actionType === 'editActivity')
                  this.setState(prevState =>
                    update(prevState, {
                      activities: {
                        [payload.state.params.editedActivityIndex]: {
                          $set: payload.state.params.editedActivity
                        }
                      }
                    })
                  );
                else if (payload.state.params.actionType === 'deleteActivity')
                  this.setState(prevState =>
                    update(prevState, {
                      activities: {
                        $splice: [[payload.state.params.editedActivityIndex, 1]]
                      }
                    })
                  );
              }
            }}
          />
        </Content>

        <Footer
          style={{
            backgroundColor: '#ffffff',
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0,
            elevation: 0
          }}>
          <Button
            style={
              !this.state.startTime ||
              !this.state.endTime ||
              this.state.startTime > this.state.endTime
                ? styles.disButton
                : styles.savebutton
            }
            onPress={this.onSave}
            disabled={
              !this.state.startTime ||
              !this.state.endTime ||
              this.state.startTime > this.state.endTime
            }>
            {this.state.saveLoading ? <Spinner /> : <Text style={styles.text}>שמור</Text>}
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5EC8F2'
  },
  disButton: {
    backgroundColor: '#d7d7d7',
    color: '#787878'
  },
  savebutton: {
    backgroundColor: '#5EC8F2',
    color: '#ffffff'
  },
  text: {
    fontFamily: 'Assistant-Bold'
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 15
  }
});

export { AttendanceTabScene };
