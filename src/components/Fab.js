import React from 'react';
import { Fab as NBFab, Button, Icon } from 'native-base';

const INITIAL_STATE = {
  fabMenuOpen: false
};

class Fab extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  render() {
    const { position, backgroundColor, buttons } = this.props;
    return (
      <NBFab
        active={this.state.fabMenuOpen}
        direction="up"
        style={{ backgroundColor }}
        position={position}
        onPress={() =>
          this.setState(state => ({
            fabMenuOpen: !state.fabMenuOpen
          }))
        }>
        {this.state.fabMenuOpen ? (
          <Icon type="Ionicons" name="close" />
        ) : (
          <Icon type={this.props.type} name={this.props.iconName} />
        )}
        {buttons.map(({ backgroundColor: bgColor, name, onPress }, i) => (
          <Button
            key={i.toString()}
            style={{ backgroundColor: bgColor }}
            onPress={() => {
              this.setState({
                fabMenuOpen: false
              });
              onPress();
            }}>
            <Icon name={name} />
          </Button>
        ))}
      </NBFab>
    );
  }
}

export { Fab };
