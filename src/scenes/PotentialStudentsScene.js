import React from 'react';
import { Container, Spinner, Button, Icon } from 'native-base';
import { FilterableList } from '../components';
import { firebase } from '../utils/firebase/firebase-db';
import { entriesToObj } from '../utils/general-utils';

class PotentialStudentsScene extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button transparent onPress={() => navigation.openDrawer()}>
          <Icon name="menu" />
        </Button>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      db: {}
    };
    const { uid } = firebase.auth().currentUser;

    this.unsubscribe = firebase
      .firestore()
      .collection('Students')
      .where('owners.tutors', 'array-contains', { uid, studentStatus: 'potential' })
      .onSnapshot(snapshot => {
        const db = entriesToObj(snapshot.docs.map(doc => [doc.id, doc.data()]));
        this.setState({
          db,
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { db, loading } = this.state;
    const { navigation } = this.props;
    return (
      <Container>
        {loading ? (
          <Spinner />
        ) : (
          <FilterableList
            data={db}
            onPress={student =>
              navigation.navigate('StudentDetailsScene', {
                student,
                previous: 'PotentialStudentsScene'
              })
            }
          />
        )}
      </Container>
    );
  }
}

export { PotentialStudentsScene };
