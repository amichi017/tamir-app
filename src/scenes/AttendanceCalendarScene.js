import React, { Component } from 'react';
import { Container, Content, Icon, Text, List, ListItem, Button } from 'native-base';
import { Agenda } from 'react-native-calendars';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import GlobalFont from 'react-native-global-font';
import moment from 'moment';
import { right } from '../utils/style-utils';
import {
  formatDate,
  formatYearAndMonth,
  toClockRange,
  getDaysCountInMonth,
  getDaysInMonth
} from '../utils/date-utils';
import { firebase } from '../utils/firebase/firebase-db';
import { entriesToObj } from '../utils/general-utils';

const AGENDA_HEADER_HEIGHT = 104;

const rowHasChanged = (r1, r2) =>
  r1.day !== r2.day ||
  r1.startTime.timestamp !== r2.startTime.timestamp ||
  r1.endTime.timestamp !== r2.endTime.timestamp;

const renderListOfActivities = activities =>
  !activities || activities.length === 0 ? (
    <View />
  ) : (
    <List>
      {activities.map(activity => (
        <ListItem style={{ justifyContent: 'flex-end' }} key={JSON.stringify(activity)}>
          <Text style={{ textAlign: right }}>{`${activity.type} ${activity.subtype}`}</Text>
        </ListItem>
      ))}
    </List>
  );

class AttendanceCalendarScene extends Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
    this.onPressEditShift = this.onPressEditShift.bind(this);
    this.state = {
      monthsLoaded: {},
      attendanceDays: {}
    };
    this.allUnsubscribes = [];
  }

  componentDidMount() {
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  componentWillUnmount() {
    this.allUnsubscribes.forEach(f => {
      f();
    });
  }

  onPressEditShift({ startTime, endTime, activities, day, uid }) {
    const allShifts = this.state.attendanceDays[moment(day).format('YYYY-MM-DD')];

    const shiftIndex = allShifts
      .map(({ startTime: startTimeS, endTime: endTimeS, activities: activitiesS }, index) => {
        return startTime.isEqual(startTimeS) &&
          endTime.isEqual(endTimeS) &&
          activities === activitiesS
          ? index
          : -1;
      })
      .filter(index => index !== -1)[0];
    this.props.navigation.navigate('EditPreviousShiftScene', {
      newShift: false,
      uid,
      day,
      db: this.props.navigation.state.params.db,
      allShifts,
      shiftIndex,
      activities,
      startTime: startTime.toDate(),
      endTime: endTime.toDate()
    });
  }

  loadItems(month) {
    const date = new Date(month.timestamp);
    if (
      !this.state.monthsLoaded[formatYearAndMonth(date)] &&
      new Date().getTime() >= month.timestamp
    ) {
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth());
      const lastOfMonth = new Date(date.getFullYear(), date.getMonth(), getDaysCountInMonth(date));

      const unsubscribe = firebase
        .firestore()
        .collection('AttendanceDays')
        .where('owners.tutors', 'array-contains', firebase.auth().currentUser.uid)
        .where('day', '>=', firstOfMonth)
        .where('day', '<=', lastOfMonth)
        .onSnapshot(snapshot => {
          this.setState(prevState => {
            const firebaseAttendanceDays = entriesToObj(
              snapshot.docs.map(doc => {
                const data = doc.data();
                const day = data.day.toDate();
                return [
                  formatDate(day),
                  data.shifts
                    ? data.shifts
                        .sort((a, b) => {
                          if (a.startTime > b.startTime) return 1;
                          if (b.startTime > a.startTime) return -1;
                          return 0;
                        })
                        .map((s, i) => ({
                          ...s,
                          uid: doc.id,
                          day,
                          last: data.shifts.length - 1 === i
                        }))
                    : []
                ];
              })
            );
            this.allUnsubscribes.push(unsubscribe);
            const daysInMonth = getDaysInMonth({
              year: date.getFullYear(),
              month: date.getMonth() + 1
            });
            const emptyAttendanceDaysInMonth = entriesToObj(daysInMonth.map(day => [day, []]));
            const attendanceDays = {
              ...emptyAttendanceDaysInMonth,
              ...prevState.attendanceDays,
              ...firebaseAttendanceDays
            };
            return {
              monthsLoaded: { ...prevState.monthsLoaded, [formatYearAndMonth(date)]: true },
              attendanceDays
            };
          });
        });
    }
  }

  renderAddNewItem = (dayOrXDate, uid) => {
    const day = uid ? dayOrXDate : dayOrXDate.toDate();
    return (
      <Container style={styles.containerAddNewItem}>
        {new Date() >= day ? (
          <Button
            onPress={() => {
              this.props.navigation.navigate('EditPreviousShiftScene', {
                newShift: true,
                uid,
                day,
                db: this.props.navigation.state.params.db,
                activities: [],
                startTime: null,
                endTime: null
              });
            }}
            transparent
            iconRight
            style={{ alignSelf: 'flex-end', paddingTop: 10 }}>
            <Text style={{ color: '#5EC8F2' }}>הוספת משמרת</Text>
            <Icon type="MaterialIcons" name="add-circle" style={{ color: '#5EC8F2' }} />
          </Button>
        ) : (
          <View />
        )}
        <Divider style={styles.dividerAddNewItem} />
      </Container>
    );
  };

  renderShift = ({ uid, day, activities, startTime, endTime, last }) =>
    !last ? (
      <TouchableOpacity
        onPress={() => this.onPressEditShift({ startTime, endTime, activities, day, uid })}
        style={[styles.item, { height: null, textAlign: right }]}>
        <Text style={{ textAlign: right }}>
          {toClockRange({ startTime: startTime.toDate(), endTime: endTime.toDate() })}
        </Text>
        {renderListOfActivities(activities)}
      </TouchableOpacity>
    ) : (
      <View>
        <TouchableOpacity
          onPress={() => this.onPressEditShift({ startTime, endTime, activities, day, uid })}
          style={[styles.item, { height: null, textAlign: right }]}>
          <Text style={{ textAlign: 'right' }}>
            {toClockRange({ startTime: startTime.toDate(), endTime: endTime.toDate() })}
          </Text>
          {renderListOfActivities(activities)}
        </TouchableOpacity>
        {this.renderAddNewItem(day, uid)}
      </View>
    );

  render() {
    return (
      <Container>
        <Content>
          <Agenda
            style={styles.agenda}
            items={this.state.attendanceDays}
            loadItemsForMonth={this.loadItems}
            selected={formatDate(new Date())}
            maxDate={formatDate(new Date())}
            renderItem={this.renderShift}
            renderEmptyDate={this.renderAddNewItem}
            rowHasChanged={rowHasChanged}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    textAlign: right
  },
  emptyDate: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: 15,
    flex: 1,
    paddingTop: 30
  },

  iconAddItem: {
    paddingTop: 35,
    paddingRight: 20,
    color: '#9EA1A8'
  },

  containerAddNewItem: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderBottomColor: '#BDC0C9',
    borderBottomWidth: 1,
    textAlign: right
  },

  insideContainerAddNewItem: {
    borderBottomColor: 'black',
    borderBottomWidth: 3
  },

  dividerAddNewItem: {
    backgroundColor: 'blue',
    height: 4
  },

  agenda: {
    height: Dimensions.get('window').height - AGENDA_HEADER_HEIGHT
  }
});

export { AttendanceCalendarScene };
