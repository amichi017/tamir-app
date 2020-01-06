import React from 'react';
import { Container, Footer, Button, Text } from 'native-base';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import GlobalFont from 'react-native-global-font';
import { right } from '../utils/style-utils';

class ManageGroupsScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newGroupDialogOpen: false,
      groups: props.navigation.state.params.db.Groups
    };
  }

  componentDidMount() {
    const fontName = 'Assistant-Bold';
    GlobalFont.applyGlobal(fontName);
  }

  render() {
    return (
      <Container>
        <FlatList
          data={Object.values(this.state.groups)}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('', {
                  db: this.props.navigation.state.params.db,
                  chosenGroup: item
                });
              }}>
              <Text style={{ textAlign: right }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <Footer>
          <Button onPress={() => console.log('open new group dialog')}>
            <Text>הוסף קבוצה חדשה</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

export { ManageGroupsScene };
