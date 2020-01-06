// firebase NATIVE App configs (created in firebase console two native apps):

// from firebase console and also saved in `ios/GoogleService-Info.plist`
const CONFIG_IOS = {
  clientId: '463912944330-q0tu8u3496nufjci84eoaeb8uvm3dhb6.apps.googleusercontent.com',
  appId: '1:463912944330:ios:64f18e29a7e438c2',
  apiKey: 'AIzaSyDh7dl3xp7tFEL4n90l7-SAhsibefQfTks',
  databaseURL: 'https://tamir-db.firebaseio.com',
  storageBucket: 'tamir-db.appspot.com',
  messagingSenderId: '463912944330',
  projectId: 'tamir-db',
  persistence: true
};

// from firebase console and also saved in `android/app/google-services.json`
const CONFIG_ANDROID = {
  clientId: '463912944330-2ugqfr9197k91cnpccme888e05ctdmer.apps.googleusercontent.com',
  appId: '1:463912944330:android:64f18e29a7e438c2',
  apiKey: 'AIzaSyCnchf2N5gv3ysE050JQYe8fLQy32OmBQs',
  databaseURL: 'https://tamir-db.firebaseio.com',
  storageBucket: 'tamir-db.appspot.com',
  messagingSenderId: '463912944330',
  projectId: 'tamir-db',
  persistence: true
};

// app name for react-native-firebase to initializeApp
const FIREBASE_APP_NAME = 'tamirapp';

// collections the we will download from firebase and store in local db
const COLLECTIONS = ['Groups', 'Students', 'AttendanceDays', 'Users'];

export { FIREBASE_APP_NAME, COLLECTIONS, CONFIG_ANDROID, CONFIG_IOS };
