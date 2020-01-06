const toFlatGroups = groups =>
  Object.keys(groups)
    .map(groupUID =>
      [{ groupUID, categoryName: groups[groupUID].name }].concat(
        Object.keys(groups[groupUID].participants).map(studentUID => ({
          groupUID,
          groupName: groups[groupUID].name,
          studentUID,
          ...groups[groupUID].participants[studentUID]
        }))
      )
    )
    .reduce((acc, curr) => acc.concat(curr), []);

const toFlatStudents = students =>
  Object.keys(students).map(studentUID => ({ ...students[studentUID], studentUID }));

const getStudentName = ({ lastName, firstName }) =>
  firstName && lastName ? `${firstName} ${lastName}` : 'ללא שם';

const normalizeData = (withCategories, multiselect, data) => {
  const flattened = withCategories ? toFlatGroups(data) : toFlatStudents(data);
  return !multiselect ? flattened : flattened.map(obj => ({ ...obj, selected: false }));
};

const filterBy = (searchText, formatFunc, aoo) =>
  aoo
    .filter(obj => searchText === '' || obj.categoryName || formatFunc(obj).includes(searchText))
    .filter(
      (elem, i, arr) =>
        searchText === '' ||
        !elem.categoryName ||
        (arr[i + 1] && arr[i + 1].groupName === elem.categoryName)
    );

const getUniqueKey = withCategories => elem => {
  if (!withCategories) return elem.studentUID;
  if (elem.categoryName) return elem.categoryName;
  return elem.groupUID + elem.studentUID;
};

export { getStudentName, normalizeData, filterBy, getUniqueKey };
