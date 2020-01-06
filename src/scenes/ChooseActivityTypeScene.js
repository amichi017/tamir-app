import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { right } from '../utils/style-utils';
import { getStudentName } from '../utils/student/student-utils';

const groups = [
  { categoryName: ' פעילות קבוצתית ' },
  { groupName: 'פעילות קבוצתית', title: 'תהליך תוכן' },
  { groupName: 'פעילות קבוצתית', title: 'מפגש עם דמות להזדהות' },
  { groupName: 'פעילות קבוצתית', title: ' חוויה ערכית / משמעותית / קודש' },
  { groupName: 'פעילות קבוצתית', title: 'שונות' },
  { categoryName: ' שיחה אישית ' },
  { groupName: 'שיחה אישית', title: 'מזדמנת' },
  { groupName: 'שיחה אישית', title: 'הכרות' },
  { groupName: 'שיחה אישית', title: 'עמוקה' },
  { groupName: 'שיחה אישית', title: 'קושי/בעיה' },
  { groupName: 'שיחה אישית', title: 'שונות' }
];
function tIcon(title) {
  if (title === ' פעילות קבוצתית ') return <Icon style={{ paddingRight: 5 }} name="people" />;
  if (title === ' שיחה אישית ') return <Icon style={{ paddingRight: 5 }} name="person" />;
  return undefined;
}
const INITIAL_STATE = {
  filteredStudents: groups
};
class ChooseActivityTypeScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  render() {
    return (
      <FlatList
        extraData={this.state.filteredStudents}
        data={this.state.filteredStudents}
        ListFooterComponent={<View style={styles.spaceAtTheEnd} />}
        keyExtractor={({ categoryName, groupName, title }) => categoryName || groupName + title}
        renderItem={({ item: { categoryName, groupName, title } }) => (
          <View style={styles.listItem}>
            {!categoryName ? (
              <TouchableOpacity
                onPress={() => {
                  const { db, returnTo, actionType } = this.props.navigation.state.params;
                  if (groupName === 'שיחה אישית') {
                    this.props.navigation.navigate('EditDiscussionDetailsScene', {
                      returnTo,
                      groupName,
                      subtype: title,
                      db,
                      actionType
                    });
                  } else if (groupName === 'פעילות קבוצתית') {
                    this.props.navigation.navigate('GroupActivityDetailsScene', {
                      actionType,
                      returnTo,
                      subtype: title,
                      groups: Object.keys(db.Groups).map(groupUID => ({
                        uid: groupUID,
                        groupName: db.Groups[groupUID].name,
                        attended: false,
                        participants: Object.keys(db.Groups[groupUID].participants).map(
                          studentUID => ({
                            uid: studentUID,
                            attended: false,
                            fullName: getStudentName(db.Students[studentUID])
                          })
                        )
                      }))
                    });
                  } else {
                    // TODO
                  }
                }}>
                <Text style={styles.studentName}>
                  <Icon key={groupName + title} /> {title}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.groupName}>
                {categoryName}
                {tIcon(categoryName)}
              </Text>
            )}
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchBox: {
    textAlign: right,
    fontFamily: 'Assistant-Bold'
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontFamily: 'Assistant-Regular',
    textAlign: right
  },
  groupName: {
    fontSize: 25,
    fontFamily: 'Assistant-Bold',
    color: '#666666',
    paddingVertical: 10,
    paddingRight: 10,
    backgroundColor: '#f6f6f6',
    textAlign: right
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'Assistant-Regular',
    paddingVertical: 10,
    paddingRight: 20,
    textAlign: right,
    marginLeft: 'auto'
  },
  spaceAtTheEnd: {
    height: 100
  }
});
export { ChooseActivityTypeScene };
