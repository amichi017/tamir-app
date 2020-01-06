/* eslint-disable no-nested-ternary */
import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { Icon, Item, Input, Text, Button } from 'native-base';
import update from 'immutability-helper';
import GlobalFont from 'react-native-global-font';
import {
  normalizeData,
  filterBy,
  getUniqueKey,
  getStudentName
} from '../utils/student/student-utils';
import { groupsWithStudentDetails, studentUIDsInGroups } from '../utils/firebase/local-db';
import { right } from '../utils/style-utils';
import { difference } from '../utils/general-utils';

const showGroupEditDialog = (
  categoryName,
  groupUID,
  addToCategory,
  onEditCategoryName,
  deleteCategory,
  onCancel
) =>
  Alert.alert(
    `עריכת ${categoryName}`,
    '',
    [
      { text: 'הוספת חניכים לקבוצה', onPress: () => addToCategory(groupUID) },
      {
        text: 'עריכת שם הקבוצה',
        onPress: () => onEditCategoryName(groupUID)
      },
      {
        text: 'מחיקת הקבוצה',
        style: 'destructive',
        onPress: () => deleteCategory(groupUID)
      },
      { text: 'ביטול', style: 'cancel', onPress: () => onCancel() }
    ],
    { cancelable: true }
  );

class FilterableList extends React.Component {
  constructor(props) {
    super(props);
    const { withCategories, data, multiselect } = this.props;
    const withStudentDetails = withCategories ? groupsWithStudentDetails(data) : data;
    const normalizedData = normalizeData(withCategories, multiselect, withStudentDetails);
    this.state = {
      searchText: '',
      normalizedData,
      filteredData: normalizedData
    };
    this.onSearch = this.onSearch.bind(this);
  }

  componentDidMount() {
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  componentWillReceiveProps({ data, withCategories, multiselect, firstSelected }) {
    if (data !== this.props.data) {
      let normalizedData;
      if (withCategories) {
        const withStudentDetails = groupsWithStudentDetails(data);

        const participatingStudents = studentUIDsInGroups(data.Groups);
        const nonParticipatingStudents = difference(data.Students, participatingStudents);
        const withStudentDetailsWithNoGroup = {
          ...withStudentDetails,
          noGroup: { name: 'לא בקבוצה', participants: nonParticipatingStudents }
        };
        normalizedData = normalizeData(withCategories, multiselect, withStudentDetailsWithNoGroup);
      } else {
        normalizedData = normalizeData(withCategories, multiselect, data);
      }
      if (firstSelected)
        this.setState(prevState => {
          if (prevState.firstSelected)
            return {
              firstSelected: false,
              normalizedData,
              filteredData: normalizedData
            };
          normalizedData[firstSelected].selected = true;
          return {
            firstSelected: true,
            normalizedData,
            filteredData: normalizedData
          };
        });
      this.setState({
        normalizedData,
        filteredData: normalizedData
      });
    }
  }

  onSearch(searchText) {
    const { normalizedData } = this.state;
    this.setState({
      searchText,
      filteredData: filterBy(searchText, getStudentName, normalizedData)
    });
  }

  render() {
    const { withCategories, multiselect, onPress, editableCategories } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Item>
          <Input
            placeholder="חיפוש"
            style={styles.searchBox}
            value={this.state.searchText}
            onChangeText={this.onSearch}
          />
          <Icon active name="search" />
        </Item>
        <FlatList
          data={this.state.filteredData}
          ListFooterComponent={<View style={styles.spaceAtTheEnd} />}
          keyExtractor={getUniqueKey(withCategories)}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              {!withCategories || (!item.categoryName && item.categoryName !== '') ? (
                this.props.multiselect &&
                this.props.noCategoryNotSelectable &&
                item.groupUID === 'noGroup' ? (
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingVertical: 5
                    }}>
                    <Text style={styles.studentName}>{getStudentName(item)}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onLongPress={() => {
                      if (
                        this.props.onLongPress &&
                        !multiselect &&
                        (!this.props.noCategoryNotSelectable || item.groupUID !== 'noGroup')
                      )
                        this.props.onLongPress(index);
                    }}
                    onPress={() => {
                      if (!multiselect) onPress(item);
                      else {
                        const { normalizedData, searchText } = this.state;
                        const newNormalizedData = update(normalizedData, {
                          [normalizedData.indexOf(item)]: { selected: { $set: !item.selected } }
                        });
                        this.setState({
                          normalizedData: newNormalizedData,
                          filteredData: filterBy(searchText, getStudentName, newNormalizedData)
                        });
                      }
                    }}
                    style={{
                      flexDirection: 'row-reverse',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingVertical: 5
                    }}>
                    <Text style={styles.studentName}>{getStudentName(item)}</Text>
                    <Icon
                      name="checkmark"
                      style={[{ fontSize: 40 }, !item.selected && { display: 'none' }]}
                    />
                  </TouchableOpacity>
                )
              ) : editableCategories ? (
                <View
                  style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    padding: 5,
                    paddingLeft: 10,
                    backgroundColor: '#f6f6f6',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      textAlign: right,
                      fontSize: 25,
                      color: '#666666',
                      fontFamily: 'Assistant-Bold'
                    }}>
                    {item.categoryName}
                  </Text>
                  {item.categoryName !== 'לא בקבוצה' ? (
                    <Button
                      transparent
                      icon
                      onPress={() =>
                        // this.props.onAddToCategory(item.groupUID)
                        showGroupEditDialog(
                          item.categoryName,
                          item.groupUID,
                          this.props.onAddToCategory,
                          this.props.onEditCategoryName,
                          this.props.deleteCategory,
                          this.props.onCancel
                        )
                      }>
                      <Icon type="MaterialIcons" name="edit" style={{ color: '#5EC8F2' }} />
                    </Button>
                  ) : (
                    <View />
                  )}
                </View>
              ) : (
                <Text style={styles.groupName}>{item.categoryName}</Text>
              )}
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBox: {
    textAlign: right,
    fontFamily: 'Assistant-Regular'
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontFamily: 'Assistant-Bold'
  },
  groupName: {
    textAlign: right,
    fontSize: 25,
    color: '#666666',
    padding: 10,
    paddingRight: 10,
    backgroundColor: '#f6f6f6',
    fontFamily: 'Assistant-Bold'
  },
  studentName: {
    fontSize: 22,
    alignSelf: 'center',
    textAlign: right,
    fontFamily: 'Assistant-Regular',
    paddingBottom: 7,
    paddingTop: 7
  },
  spaceAtTheEnd: {
    height: 100
  }
});
export { FilterableList };
