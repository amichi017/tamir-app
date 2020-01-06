import { YellowBox } from 'react-native';

const ignoreFirebaseLoadingWarnings = () => {
  YellowBox.ignoreWarnings(['Setting a timer']);
  const newconsole = { ...console };
  console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
      newconsole.warn(message);
    }
  };
};

export { ignoreFirebaseLoadingWarnings };
