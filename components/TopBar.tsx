import { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import React from 'react';

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
        <View style={styles.day}>
          <Text style={styles.paragraph}>
            {this.formatDate(selectedDay)}
          </Text>
        </View>
        <TouchableOpacity onPress={onCalendarPressed} activeOpacity={0.5}>
          <Image style={styles.calendarIcon} 
                 source={require('../assets/icons/calendar-month.svg')} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    paddingBottom: 5,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  day: {
    flexGrow: 4,
    marginLeft: 50
  },
  calendarIcon: {
    marginRight: 5
  }
});

export default TopBar;