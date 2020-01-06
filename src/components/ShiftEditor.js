/* eslint-disable no-nested-ternary */
import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import GlobalFont from 'react-native-global-font';
import { toClockTime } from '../utils/date-utils';
import { right } from '../utils/style-utils';

const renderActivity = ({ type, subtype, groups, student }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start' }}>
    <Icon name="create" style={{ fontSize: 24, color: '#5EC8F2', paddingLeft: 10 }} />
    <View style={{ flexDirection: 'column' }}>
      <Text style={styles.activityListItem}>{type}</Text>
      <Text style={[styles.textfont, { textAlign: right }]}>{subtype}</Text>
      {type === 'שיחה אישית' ? (
        <Text style={[styles.textfont, { textAlign: right }]}> עם {student.fullName}</Text>
      ) : groups.filter(({ attended }) => attended).length === 0 ? null : (
        [<Text style={[styles.textfont, { textAlign: right }]}>עם:</Text>].concat(
          groups
            .filter(({ attended }) => attended)
            .map(({ groupName }) => (
              <View style={{ flexDirection: 'row-reverse' }}>
                <Text style={{ paddingHorizontal: 5 }}>{`\u2022`}</Text>
                <Text style={[styles.textfont, { textAlign: right }]}>{groupName}</Text>
              </View>
            ))
        )
      )}
    </View>
  </View>
  //   switch (type) {
  //     case 'שיחה אישית':
  //       return `${type} - ${subtype} עם: ${student.fullName}`;
  //     case 'פעילות קבוצתית':
  //       return `${type} - ${subtype} עם:\n ${groups
  //         .filter(({ attended }) => attended)
  //         .map(({ groupName }) => groupName)
  //         .toString()}`;
  //     default:
  //       return null;
  // }
);

class ShiftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.showStartTimePicker = this.showStartTimePicker.bind(this);
    this.showEndTimePicker = this.showEndTimePicker.bind(this);
    this.hideEndTimePicker = this.hideEndTimePicker.bind(this);
    this.hideStartTimePicker = this.hideStartTimePicker.bind(this);
    this.handleStartTimePicked = this.handleStartTimePicked.bind(this);
    this.handleEndTimePicked = this.handleEndTimePicked.bind(this);
    this.state = {
      startTimePickerOpen: false,
      endTimePickerOpen: false
    };
  }

  componentDidMount() {
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  showStartTimePicker() {
    this.setState({ startTimePickerOpen: true });
  }

  showEndTimePicker() {
    this.setState({ endTimePickerOpen: true });
  }

  hideStartTimePicker() {
    this.setState({ startTimePickerOpen: false });
  }

  hideEndTimePicker() {
    this.setState({ endTimePickerOpen: false });
  }

  handleStartTimePicked(time) {
    this.props.handleStartTimePicked(time);
    this.setState({ startTimePickerOpen: false });
  }

  handleEndTimePicked(time) {
    this.props.handleEndTimePicked(time);
    this.setState({ endTimePickerOpen: false });
  }

  renderTime({ startTime, endTime }) {
    const time = startTime || endTime;
    if (time) {
      return (
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() =>
            startTime ? this.showStartTimePicker(time) : this.showEndTimePicker(time)
          }>
          <Icon
            name="create"
            style={{ fontSize: 20, color: '#5EC8F2', paddingTop: 5, paddingRight: 5 }}
          />
          <Text style={styles.time}>{toClockTime(time)}</Text>
        </TouchableOpacity>
      );
    }
    return <Text style={styles.time}>{toClockTime(time)}</Text>;
  }

  render() {
    return (
      <View>
        <View style={[styles.section, { marginBottom: 30 }]}>
          {this.renderTime({ startTime: this.props.startTime })}
          <Button
            style={this.props.startTime ? styles.disButton : styles.button}
            disabled={!!this.props.startTime}
            onPress={() => this.handleStartTimePicked(new Date())}>
            <Text style={styles.textfont}>כניסה</Text>
          </Button>
        </View>
        <View
          style={[
            styles.section,
            {
              marginBottom: 30,
              borderBottomWidth: 3,
              borderBottomColor: '#CCCCCC',
              paddingBottom: 30
            }
          ]}>
          {this.renderTime({ endTime: this.props.endTime })}
          <Button
            style={!this.props.startTime || !!this.props.endTime ? styles.disButton : styles.button}
            disabled={!this.props.startTime || !!this.props.endTime}
            onPress={() => {
              this.handleEndTimePicked(new Date());
              if (!this.props.activities || this.props.activities.length === 0)
                this.props.onPressAddActivity();
            }}>
            <Text style={styles.textfont}>יציאה</Text>
          </Button>
        </View>

        <View style={[styles.section, { paddingBottom: 5 }]}>
          <Text style={styles.activities}>פעילויות</Text>
          <Icon name="arrow-dropdown" style={{ color: '#787878' }} />
        </View>
        <FlatList
          style={{ paddingRight: 40 }}
          data={this.props.activities}
          keyExtractor={item => JSON.stringify(item)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.props.onPressEditActivity(item, index)}
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                borderBottomWidth: 3,
                borderBottomColor: '#CCCCCC'
              }}>
              {/* <Text style={styles.activityListItem}> */}
              {renderActivity(item)}
              {/* </Text> */}
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={this.props.onPressAddActivity}
          style={[styles.section, { paddingRight: 30, paddingTop: 10 }]}>
          <Text style={styles.activities}>הוסף פעילות</Text>
          <Icon type="MaterialIcons" name="add-circle-outline" />
        </TouchableOpacity>
        <DateTimePicker
          mode="time"
          date={this.props.startTime}
          isVisible={!!this.state.startTimePickerOpen}
          onConfirm={this.handleStartTimePicked}
          onCancel={this.hideStartTimePicker}
        />
        <DateTimePicker
          mode="time"
          date={this.props.endTime}
          isVisible={!!this.state.endTimePickerOpen}
          onConfirm={this.handleEndTimePicked}
          onCancel={this.hideEndTimePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5EC8F2',

    fontFamily: 'Assistant-Bold'
  },
  disButton: {
    backgroundColor: '#d7d7d7',

    fontFamily: 'Assistant-Bold'
  },
  container: {
    flexDirection: 'column',
    padding: 10,
    fontFamily: 'Assistant-Bold',
    color: '#787878'
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 15,
    color: '#787878',
    fontFamily: 'Assistant-Bold'
  },
  time: {
    padding: 5,
    paddingRight: 50,
    color: '#787878',
    fontFamily: 'Assistant-Bold'
  },
  activities: {
    textAlign: right,
    paddingRight: 10,
    fontSize: 18,
    fontFamily: 'Assistant-Bold',
    color: '#787878'
  },
  activityListItem: {
    textAlign: right,
    fontFamily: 'Assistant-Bold',
    color: '#787878'
  },
  text: {
    fontFamily: 'Assistant-Bold',
    color: '#787878'
  },
  textfont: {
    fontFamily: 'Assistant-Regular'
  }
});

export { ShiftEditor };
