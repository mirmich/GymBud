import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { darkMode, globalStyle } from '../model/GlobalStyles';
import { Entypo } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import ProfileQueries from '../services/queries/ProfileQueries';
import StrengthLevelQueries from '../services/queries/StrengthLevelQueries';
/*
            [0, 71] < 5%
            [71, 94]   5% - 20%  
            [94, 122]  20% - 50%
            [122, 153] 50% - 80%
            [153, 187] 80% - 95%
            [187, Infinity] > 95% 
*/

type ProgressProps = {
  exerciseName: string,
  oneRepMax: number
}
export default function Progress(props: ProgressProps) {
  const queryClient = useQueryClient();
  const levels = ['Weak', 'Begginer', 'Novice', 'Intermediate', 'Advanced', 'Elite'];
  const { data: bodyWeight } = ProfileQueries.getProfileProperty("bodyWeight");
  const { data: position0 } = StrengthLevelQueries.getPosition(
    props.exerciseName,
    bodyWeight,
    props.oneRepMax
  );
  console.log(props.exerciseName);
  console.log(bodyWeight);
  console.log(props.oneRepMax);
  console.log(position0);
  return (
    <View>
      <View style={styles.textContainer}>
      <Text style={styles.text}>{levels[(position0 == null ? 0 : position0.index)]}</Text>
      </View>
      <View style={styles.container}>
        <Entypo name="triangle-down" size={24} color='#828282' style={{
          position: 'absolute',
          top: -14,
          left: 300 * (position0 == null ? 0 : position0.position),
          zIndex: 998,
          }} />
        <View style={styles.barContainer}>
          <View style={styles.purple}></View>
          <View style={styles.pink}></View>
          <View style={styles.white}></View>
          <View style={styles.yellow}></View>
          <View style={styles.red}></View>
          <View style={styles.blue}></View>
        </View>
      </View>
    </View>
  );
}

const pointerPointer = (position: number) => {
  return {
    position: 'absolute',
    top: -14,
    left: 300/position,
    zIndex: 998,
  }
}

const barHeight = 10;
const barBorderWidth = 1;
const barBorderColor = darkMode.accentGrey;
const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  text: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  pointer: {
    position: 'absolute',
    top: -14,
    left: 270,
    zIndex: 998,
  },
  rating: {
    backgroundColor: darkMode.background,
  },
  purple: {
    width: 30,
    height: barHeight,
    backgroundColor: '#4b006e',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftWidth: barBorderWidth,
    borderBottomWidth: barBorderWidth,
    borderTopWidth: barBorderWidth,
    borderColor: barBorderColor,

  },
  pink: {
    width: 45,
    height: barHeight,
    backgroundColor: '#E73895',
    //borderLeftWidth: barBorderWidth,
    borderBottomWidth: barBorderWidth,
    borderTopWidth: barBorderWidth,
    borderColor: barBorderColor,
  },
  white: {
    width: 90,
    height: barHeight,
    backgroundColor: '#FFF',
    //borderLeftWidth: barBorderWidth,
    borderBottomWidth: barBorderWidth,
    borderTopWidth: barBorderWidth,
    borderColor: barBorderColor,
  },
  yellow: {
    width: 90,
    height: barHeight,
    backgroundColor: '#FADA5E',
    //borderLeftWidth: barBorderWidth,
    borderBottomWidth: barBorderWidth,
    borderTopWidth: barBorderWidth,
    borderColor: barBorderColor,
  },
  red: {
    width: 45,
    height: barHeight,
    backgroundColor: '#9B1C31',
    //borderWidth: barBorderWidth,
    borderBottomWidth: barBorderWidth,
    borderTopWidth: barBorderWidth,
    borderColor: barBorderColor,
  },
  blue: {
    width: 30,
    height: barHeight,
    backgroundColor: '#4169e1',
    borderRightWidth: barBorderWidth,
    borderBottomWidth: barBorderWidth,
    borderTopWidth: barBorderWidth,
    borderColor: barBorderColor,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4
  }
});
