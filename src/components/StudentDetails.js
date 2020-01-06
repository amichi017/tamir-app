import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Content } from 'native-base';
import { right } from '../utils/style-utils';
import { options, studentFieldsOrder, formatValue } from '../utils/student/constants';
import { exists } from '../utils/general-utils';

const StudentDetails = ({ student }) => (
  <Content style={{ flexDirection: 'column' }}>
    {studentFieldsOrder.filter(exists(student)).map(field => (
      <View
        key={field}
        style={{
          flexDirection: 'row-reverse',
          borderBottomColor: '#CCCCCC',
          borderBottomWidth: 1
        }}>
        <Text style={styles.fieldName}>{options.fields[field].label}</Text>
        <Text style={styles.fieldValues}>{formatValue(field, student[field])}</Text>
      </View>
    ))}
  </Content>
);

const styles = StyleSheet.create({
  fieldName: {
    textAlign: right,
    fontSize: 19,
    paddingVertical: 10,
    paddingRight: 10,
    alignSelf: 'center',
    width: 135
  },
  fieldValues: {
    alignSelf: 'center',
    textAlign: right,
    fontSize: 19,
    paddingVertical: 10,
    fontFamily: 'Assistant-Regular'
  }
});

export { StudentDetails };
