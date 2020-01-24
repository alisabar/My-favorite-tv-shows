/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, StyleSheet} from 'react-native';
import LoginStackNavigator from './android/app/src/components/Tabs';

``
function App() {
  return (
    <View className="App" style={styles.container}>
         <LoginStackNavigator/>
    </View>
  );
};



export default App;
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' }

  })