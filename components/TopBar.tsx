import { Component } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { darkMode } from '../model/GlobalStyles';

interface TopBarProps {
  selectedDay: string;
  onCalendarPressed: () => void;
}

class TopBar extends Component<TopBarProps> {

  private formatDate(selectedDay: string): string {
    if (selectedDay === format(new Date(),'yyyy-MM-dd')) {
      return 'Today';
    }
    return format(new Date(selectedDay), 'MMMM dd yyyy');
  }
  public render() {
    const { selectedDay, onCalendarPressed } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.formatDate(selectedDay)}
        </Text>
        <Pressable onPress={onCalendarPressed}>
        <FontAwesome5 
          name="calendar-alt" 
          size={24} 
          color={darkMode.fontColor} />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkMode.accentPurple,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: darkMode.fontColor,
  }
});

export default TopBar;