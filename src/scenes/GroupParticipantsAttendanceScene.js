import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Container, Text, CheckBox } from 'native-base';
import GlobalFont from 'react-native-global-font';
import { right } from '../utils/style-utils';

class GroupParticipantsAttendanceScene extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { groups, index } = navigation.state.params;
    return {
      title: `נוכחות ${groups[index].groupName}`,
      headerRight: <Button onPress={navigation.state.params.onSave} title="שמור" />
    };
  };

  constructor(props) {
    super(props);
    this.selectAll = this.selectAll.bind(this);
    this.onPressCheckboxOnListItem = this.onPressCheckboxOnListItem.bind(this);
    this.onSave = this.onSave.bind(this);
    this.state = {
      groups: JSON.parse(JSON.stringify(this.props.navigation.state.params.groups)),
      allSelected: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSave: this.onSave });
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  onSave() {
    const newGroups = [...this.state.groups];
    newGroups[this.props.navigation.state.params.index].attended = true;
    this.props.navigation.navigate('GroupActivityDetailsScene', { groups: newGroups });
  }

  onPressCheckboxOnListItem(participant, itemIndex) {
    const { index } = this.props.navigation.state.params;
    this.setState(prevState => {
      const nextState = { ...prevState };
      nextState.groups[index].participants[itemIndex].attended = !participant.attended;
      if (participant.attended && prevState.allSelected) nextState.allSelected = false;
      return nextState;
    });
  }

  selectAll() {
    const { index } = this.props.navigation.state.params;
    this.setState(prevState => {
      const nextState = { ...prevState };
      for (let i = 0; i < prevState.groups[index].participants.length; i += 1)
        nextState.groups[index].participants[i].attended = !prevState.allSelected;
      nextState.allSelected = !prevState.allSelected;
      return nextState;
    });
  }

  render() {
    return (
      <Container>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View
            style={{
              height: 70,
              flexDirection: 'row-reverse',
              borderBottomWidth: 1,
              borderBottomColor: 'grey'
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Text
                style={{
                  fontWeight: 'bold'
                }}>
                נוכחות
              </Text>
              <CheckBox
                style={{ marginTop: 5, marginRight: 10 }}
                checked={this.state.allSelected}
                onPress={this.selectAll}
              />
            </View>
            <Text
              style={{
                flex: 3,
                fontWeight: 'bold',
                paddingTop: 10,
                marginRight: 20,
                textAlign: right
              }}>
              שם החניך
            </Text>
          </View>
          <FlatList
            extraData={this.state}
            data={this.state.groups[this.props.navigation.state.params.index].participants}
            keyExtractor={participant => participant.uid}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => this.onPressCheckboxOnListItem(item, index)}
                style={{
                  flexDirection: 'row-reverse',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DEE1E8',
                  alignItems: 'center'
                }}>
                <View style={{ alignItems: 'center', marginRight: 17 }}>
                  <CheckBox
                    checked={item.attended}
                    onPress={() => this.onPressCheckboxOnListItem(item, index)}
                  />
                </View>
                <Text
                  style={{
                    textAlign: right,
                    marginRight: 30,
                    marginLeft: 100,
                    paddingLeft: 20,
                    paddingTop: 20,
                    paddingBottom: 20
                  }}>
                  {item.fullName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Container>
    );
  }
}

export { GroupParticipantsAttendanceScene };
