import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        GymBuddy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor : 'black',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15
  },
  paragraph: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  }
});
