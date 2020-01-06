import update from 'immutability-helper';
import { entriesToObj, groupBy, difference, removeKeysIf } from '../general-utils';

const groupsWithStudentDetails = db =>
  update(db.Groups, {
    $set: entriesToObj(
      Object.keys(db.Groups).map(groupUID => [
        groupUID,
        update(db.Groups[groupUID], {
          participants: {
            $set: entriesToObj(
              Object.entries(db.Groups[groupUID].participants)
                .map(([studentUID]) => [studentUID, db.Students[studentUID]])
                .filter(([, student]) => student)
            )
          }
        })
      ])
    )
  });

const removeParticipantsThatDontExist = (groups, students) =>
  entriesToObj(
    Object.entries(groups).map(([guid, groupData]) => [
      guid,
      {
        ...groupData,
        participants: removeKeysIf(studentUID => students[studentUID], groupData.participants)
      }
    ])
  );

const studentUIDsInGroups = groups =>
  Object.values(groups)
    .map(({ participants }) => participants)
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

const selectedStudentsEntries = students =>
  Object.entries(
    groupBy(
      students
        .filter(({ selected }) => selected)
        .map(({ groupUID, studentUID }) => ({ groupUID, studentUID })),
      'groupUID'
    )
  ).map(([key, values]) => [key, values.map(({ studentUID }) => studentUID)]);

const dbWithNoGroup = db => {
  const participatingStudents = studentUIDsInGroups(db.Groups);
  const nonParticipatingStudents = difference(db.Students, participatingStudents);
  return {
    ...db,
    Groups: {
      ...db.Groups,
      noGroup: { name: 'לא בקבוצה', participants: nonParticipatingStudents }
    }
  };
};

const setOwnersToStudentStatus = (tutorUID, owners, newStudentStatus) => ({
  ...owners,
  tutors: owners.tutors.map(({ uid, studentStatus }) =>
    uid === tutorUID ? { uid, studentStatus: newStudentStatus } : { uid, studentStatus }
  )
});

export {
  groupsWithStudentDetails,
  studentUIDsInGroups,
  selectedStudentsEntries,
  dbWithNoGroup,
  removeParticipantsThatDontExist,
  setOwnersToStudentStatus
};
