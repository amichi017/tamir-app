import React from 'react';
import { Container } from 'native-base';
import { FilterableList } from '../components';
import { getStudentName } from '../utils/student/student-utils';

class ChooseStudentScene extends React.PureComponent {
  render() {
    return (
      <Container>
        <FilterableList
          withCategories
          data={this.props.navigation.state.params.db}
          onPress={student =>
            this.props.navigation.navigate('EditDiscussionDetailsScene', {
              student: {
                uid: student.studentUID,
                fullName: getStudentName(student)
              }
            })
          }
        />
      </Container>
    );
  }
}

export { ChooseStudentScene };
