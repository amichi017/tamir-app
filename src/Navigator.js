/* eslint-disable no-unused-vars */
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from 'react-navigation';
import {
  AttendanceCalendarScene,
  EditPreviousShiftScene,
  StudentDetailsScene,
  GroupParticipantsAttendanceScene,
  GroupActivityDetailsScene,
  StudentFormScene,
  PotentialStudentsScene,
  SelectMultipleStudentsScene,
  ManageGroupsScene,
  ChooseStudentScene,
  ChooseActivityTypeScene,
  EditDiscussionDetailsScene,
  PhoneInputScene,
  SmsCodeConfirmScene,
  AuthLoadingScene
} from './scenes';
import MainScene from './scenes/MainScene';
import { Drawer } from './components';

const MainStack = createStackNavigator(
  {
    MainScene: {
      screen: MainScene
    },
    StudentDetailsScene: {
      screen: StudentDetailsScene
    },
    StudentFormScene: {
      screen: StudentFormScene,
      navigationOptions: {
        title: 'פרטי חניך'
      }
    },
    ManageGroupsScene: {
      screen: ManageGroupsScene
    },
    ChooseActivityTypeScene: {
      screen: ChooseActivityTypeScene,
      navigationOptions: {
        title: 'פעילות שבוצעה'
      }
    },
    EditDiscussionDetailsScene: {
      screen: EditDiscussionDetailsScene,
      navigationOptions: {
        title: 'שיחה אישית'
      }
    },
    ChooseStudentScene: {
      screen: ChooseStudentScene,
      navigationOptions: {
        title: 'בחירת חניך'
      }
    },
    GroupActivityDetailsScene: {
      screen: GroupActivityDetailsScene,
      navigationOptions: {
        title: 'פעילות קבוצתית'
      }
    },
    AttendanceCalendarScene: {
      screen: AttendanceCalendarScene,
      navigationOptions: {
        title: 'נוכחות קודמת'
      }
    },
    EditPreviousShiftScene: {
      screen: EditPreviousShiftScene
    },
    GroupParticipantsAttendanceScene: {
      screen: GroupParticipantsAttendanceScene
    },
    SelectMultipleStudentsScene: {
      screen: SelectMultipleStudentsScene
    }
  },
  {
    initialRouteName: 'MainScene',
    navigationOptions: {
      title: 'חניכים'
    }
  },
  {
    headerMode: 'none'
  }
);
const PotentialStudentsStack = createStackNavigator({
  PotentialStudentsScene: {
    screen: PotentialStudentsScene,
    navigationOptions: {
      title: 'חניכים פוטנציאלים'
    }
  },
  StudentDetailsScene: {
    screen: StudentDetailsScene,
    navigationOptions: {
      title: 'פרטי החניך'
    }
  }
});

const AppWithDrawer = createDrawerNavigator(
  {
    MainStack: {
      screen: MainStack,
      navigationOptions: {
        title: 'חזרה לבית'
      }
    },
    PotentialStudentsStack: {
      screen: PotentialStudentsStack,
      navigationOptions: {
        title: 'חניכים פוטנציאלים'
      }
    }
  },
  {
    contentComponent: Drawer,
    initialRouteName: 'MainStack',
    order: ['MainStack', 'PotentialStudentsStack'],
    drawerPosition: 'right',
    contentOptions: {
      itemStyle: {
        justifyContent: 'flex-end'
      }
    }
  }
);

const AuthStack = createStackNavigator({
  PhoneInputScene: {
    screen: PhoneInputScene,
    navigationOptions: {
      title: 'התחברות'
    }
  },
  SmsCodeConfirmScene: {
    screen: SmsCodeConfirmScene,
    navigationOptions: {
      title: 'אמת סיסמה'
    }
  }
});

const AppWithAuth = createSwitchNavigator(
  {
    AuthLoadingScene,
    AuthStack,
    AppWithDrawer
  },
  { initialRouteName: 'AuthLoadingScene' }
);

export default createAppContainer(AppWithAuth);
