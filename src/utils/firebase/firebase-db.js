import { Platform } from 'react-native';
import rnfirebase from 'react-native-firebase';
import { entriesToObj } from '../general-utils';
import { FIREBASE_APP_NAME, COLLECTIONS, CONFIG_ANDROID, CONFIG_IOS } from './constants';
import { removeTime } from '../date-utils';
import { setOwnersToStudentStatus } from './local-db';
/**
 * This is the variable to use to replace previous firebase web api's
 * */
const firebase = rnfirebase.initializeApp(
  Platform.OS === 'ios' ? CONFIG_IOS : CONFIG_ANDROID,
  FIREBASE_APP_NAME
);
/**
 * returns a promise when firebase is initialized
 * use this function first and only once when app first loads data from firebase.
 * afterwards use firebase variable to access firebase api
 * */
const initNativeFirebase = () => firebase.onReady();

const toState = (collection, docsSnapshot, prevState, applyToDoc) => {
  const otherCollections = COLLECTIONS.filter(c => c !== collection);
  const existAlready = otherCollections.filter(c => prevState[c]);
  if (otherCollections.length === existAlready.length)
    return {
      loadedAll: true,
      [collection]: entriesToObj(
        docsSnapshot.docs.map(doc => [doc.id, applyToDoc ? applyToDoc(doc.data()) : doc.data()])
      )
    };
  return {
    [collection]: entriesToObj(
      docsSnapshot.docs.map(doc => [doc.id, applyToDoc ? applyToDoc(doc.data()) : doc.data()])
    )
  };
};

const toStateDoc = (collection, docSnapshot, prevState, applyToDoc) => {
  const otherCollections = COLLECTIONS.filter(c => c !== collection);
  const existAlready = otherCollections.filter(c => prevState[c]);
  if (otherCollections.length === existAlready.length)
    return {
      loadedAll: true,
      [collection]: entriesToObj([
        [docSnapshot.id, applyToDoc ? applyToDoc(docSnapshot.data()) : docSnapshot.data()]
      ])
    };
  return {
    [collection]: entriesToObj([
      [docSnapshot.id, applyToDoc ? applyToDoc(docSnapshot.data()) : docSnapshot.data()]
    ])
  };
};

const readDB = (uid, that) => {
  return COLLECTIONS.map(collection => {
    if (collection === 'AttendanceDays')
      return firebase
        .firestore()
        .collection(collection)
        .where('owners.tutors', 'array-contains', uid)
        .where('day', '==', removeTime(new Date()))
        .onSnapshot(snapshot => {
          that.setState(prevState => toState(collection, snapshot, prevState));
        });
    if (collection === 'Students')
      return firebase
        .firestore()
        .collection(collection)
        .where('owners.tutors', 'array-contains', { uid, studentStatus: 'normal' })
        .onSnapshot(snapshot => {
          that.setState(prevState => toState(collection, snapshot, prevState, timestampsToDates));
        });
    if (collection === 'Users')
      return firebase
        .firestore()
        .collection(collection)
        .doc(uid)
        .onSnapshot(snapshot => {
          that.setState(prevState =>
            toStateDoc(collection, snapshot, prevState, timestampsToDates)
          );
        });
    return firebase
      .firestore()
      .collection(collection)
      .where('owners.tutors', 'array-contains', uid)
      .onSnapshot(snapshot => {
        that.setState(prevState => toState(collection, snapshot, prevState));
      });
  });
};

const updateDoc = (collection, uid, obj) =>
  firebase
    .firestore()
    .collection(collection)
    .doc(uid)
    .set(obj);

const createNewGroup = newGroupName =>
  firebase
    .firestore()
    .collection('Groups')
    .add({
      owners: { tutors: [firebase.auth().currentUser.uid] },
      name: newGroupName,
      participants: {}
    });

const deleteGroup = groupUID =>
  firebase
    .firestore()
    .collection('Groups')
    .doc(groupUID)
    .delete();

const editGroupName = (groupUID, newName) =>
  firebase
    .firestore()
    .collection('Groups')
    .doc(groupUID)
    .update({ name: newName });

const timestampsToDates = obj =>
  obj
    ? entriesToObj(
        Object.entries(obj).map(([k, v]) =>
          v instanceof rnfirebase.firestore.Timestamp ? [k, v.toDate()] : [k, v]
        )
      )
    : {};

const setStudentStatus = (student, studentStatus) =>
  firebase
    .firestore()
    .collection('Students')
    .doc(student.studentUID)
    .set(
      {
        owners: setOwnersToStudentStatus(
          firebase.auth().currentUser.uid,
          student.owners,
          studentStatus
        )
      },
      { merge: true }
    );

export {
  firebase,
  readDB,
  updateDoc,
  initNativeFirebase,
  rnfirebase,
  createNewGroup,
  deleteGroup,
  editGroupName,
  setStudentStatus
};
