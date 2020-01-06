import React from 'react';
import { Button } from 'react-native';
import { Container } from 'native-base';
import GlobalFont from 'react-native-global-font';
import { FilterableList } from '../components';
import { firebase } from '../utils/firebase/firebase-db';
import { entriesToObj } from '../utils/general-utils';

class SelectMultipleStudentsScene extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { groupName, filterableListRef, groupUID, groupData } = navigation.state.params;
    return {
      title: `בחרו חניכים ל${groupName}`,
      headerRight: (
        <Button
          onPress={() => {
            const participantsToAdd = entriesToObj(
              filterableListRef.current.state.normalizedData
                .filter(({ selected }) => selected)
                .map(({ studentUID }) => [studentUID, true])
            );
            firebase
              .firestore()
              .collection('Groups')
              .doc(groupUID)
              .update({ participants: { ...groupData.participants, ...participantsToAdd } });
            navigation.navigate('MainScene');
          }}
          title="הוסף"
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.filterableListRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setParams({ filterableListRef: this.filterableListRef });
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  render = () => (
    <Container>
      <FilterableList
        data={this.props.navigation.state.params.db}
        withCategories
        multiselect
        ref={this.filterableListRef}
      />
    </Container>
  );
}

export { SelectMultipleStudentsScene };
