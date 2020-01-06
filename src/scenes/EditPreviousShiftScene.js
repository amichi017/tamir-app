import React from 'react';
import { StyleSheet, Button } from 'react-native';
import { Content, Container, Button as NBButton, Text, View } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import update from 'immutability-helper';
import GlobalFont from 'react-native-global-font';
import { addToEndIfDoesntExistAtEnd } from '../utils/general-utils';
import { timeWithDay } from '../utils/date-utils';
import { firebase, rnfirebase } from '../utils/firebase/firebase-db';
import { ShiftEditor } from '../components';

class EditPreviousShiftScene extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: moment(navigation.state.params.day).format('DD/MM/YYYY'),
      headerRight: (
        <Button
          disabled={
            !navigation.getParam('startTime') ||
            !navigation.getParam('endTime') ||
            navigation.getParam('startTime') > navigation.getParam('endTime')
          }
          onPress={navigation.state.params.onSave}
          title="שמור"
        />
      )
    };
  };

  constructor(props) {
    super(props);
    const { activities, startTime, endTime } = props.navigation.state.params;
    this.state = {
      activities: activities || [],
      startTime: startTime || null,
      endTime: endTime || null
    };
    this.handleStartTimePicked = this.handleStartTimePicked.bind(this);
    this.handleEndTimePicked = this.handleEndTimePicked.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSave: this.onSave });
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  onSave() {
    const { uid, day, newShift, db, allShifts, shiftIndex } = this.props.navigation.state.params;
    const { startTime, endTime, activities } = this.state;
    const startTimeWithDay = timeWithDay(day, startTime);
    const endTimeWithDay = timeWithDay(day, endTime);
    if (newShift) {
      if (uid) {
        firebase
          .firestore()
          .collection('AttendanceDays')
          .doc(uid)
          .update({
            shifts: rnfirebase.firestore.FieldValue.arrayUnion({
              startTime: startTimeWithDay,
              endTime: endTimeWithDay,
              activities
            })
          });
      } else {
        firebase
          .firestore()
          .collection('AttendanceDays')
          .add({
            owners: { tutors: [firebase.auth().currentUser.uid] },
            day,
            shifts: [
              {
                startTime: startTimeWithDay,
                endTime: endTimeWithDay,
                activities
              }
            ]
          });
      }
    } else {
      const allShiftsStripped = allShifts.map(
        ({ activities: _activities, endTime: _endTime, startTime: _startTime }) => ({
          activities: _activities,
          endTime: _endTime,
          startTime: _startTime
        })
      );
      allShiftsStripped[shiftIndex] = {
        startTime: startTimeWithDay,
        endTime: endTimeWithDay,
        activities
      };
      firebase
        .firestore()
        .collection('AttendanceDays')
        .doc(uid)
        .set({ shifts: allShiftsStripped }, { merge: true });
    }
    this.props.navigation.navigate('AttendanceCalendarScene', { db });
  }

  handleStartTimePicked(time) {
    this.setState({ startTime: time });
    this.props.navigation.setParams({ startTime: time });
  }

  handleEndTimePicked(time) {
    this.setState({ endTime: time });
    this.props.navigation.setParams({ endTime: time });
  }

  render() {
    const { db, newShift, uid, allShifts, shiftIndex } = this.props.navigation.state.params;
    return (
      <Container style={{ padding: 10 }}>
        <Content>
          {!newShift ? (
            <NBButton
              onPress={() => {
                const allShiftsStripped = allShifts.map(
                  ({ activities: _activities, endTime: _endTime, startTime: _startTime }) => ({
                    activities: _activities,
                    endTime: _endTime,
                    startTime: _startTime
                  })
                );
                delete allShiftsStripped[shiftIndex];
                firebase
                  .firestore()
                  .collection('AttendanceDays')
                  .doc(uid)
                  .set({ shifts: allShiftsStripped }, { merge: true });
                this.props.navigation.navigate('AttendanceCalendarScene', { db });
              }}
              danger
              style={{ alignSelf: 'flex-end', marginBottom: 30 }}>
              <Text>מחיקת נוכחות</Text>
            </NBButton>
          ) : (
            <View />
          )}
          <ShiftEditor
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            activities={this.state.activities}
            onPressAddActivity={() =>
              this.props.navigation.navigate('ChooseActivityTypeScene', {
                db,
                actionType: 'newActivity',
                returnTo: 'EditPreviousShiftScene'
              })
            }
            onPressEditActivity={(
              { type, subtype, groups, student, comments },
              editedActivityIndex
            ) => {
              const actionType = 'editActivity';
              if (type === 'שיחה אישית')
                this.props.navigation.navigate('EditDiscussionDetailsScene', {
                  returnTo: 'EditPreviousShiftScene',
                  actionType,
                  editedActivityIndex,
                  student,
                  type,
                  subtype,
                  comments,
                  db
                });
              else if (type === 'פעילות קבוצתית')
                this.props.navigation.navigate('GroupActivityDetailsScene', {
                  returnTo: 'EditPreviousShiftScene',
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
      </Container>
    );
  }
}

export { EditPreviousShiftScene };
