import React from 'react';
import { Container, Icon, Button, Text } from 'native-base';
import { StudentDetails } from '../components';

const student = {
  'שם פרטי': 'חניך',
  'שם משפחה': 'א׳',
  נייד: '050-222-2222',
  מין: 'ז',
  כיתה: ['ג', 4],
  'מוסד לימודים': 'בית ספר דוגמה',
  כתובת: 'הרב שלום שבזי 3',
  שכונה: 'נחלאות',
  'תאריך לידה': new Date(2011, 9, 22),
  'תעודת זהות': '204070635',
  עיר: 'ירושלים',
  מייל: 'student_A@gmail.com',
  'מידה חולצה': 'S',
  חברים: 'נעם, צחי, חיים, דני'
};

const ViewPotentialStudentDetailsScene = () => {
  const { buttonTowStyle, buttonOnStyle, textStyle } = styles;
  return (
    <Container style={{ flexDirection: 'column' }}>
      {/* <Header title={`${student['שם פרטי']} ${student['שם משפחה']}`} back /> */}
      <StudentDetails student={student} />

      <Button style={buttonOnStyle}>
        <Icon name="arrow-back" />
        <Text style={textStyle}>העבר לחניכים שלי</Text>
      </Button>
      <Button style={buttonTowStyle}>
        <Icon name="trash" />
        <Text style={textStyle}> לא רלוונטי </Text>
      </Button>
    </Container>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16
  },
  buttonOnStyle: {
    alignSelf: 'stretch',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    marginTop: 35
  },
  buttonTowStyle: {
    alignSelf: 'stretch',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 20,
    marginTop: 5
  }
};

export { ViewPotentialStudentDetailsScene };
