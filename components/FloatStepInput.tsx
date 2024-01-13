import { Component } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Button, TextInput, Pressable } from 'react-native';
import { addition, subtraction, OperatorFunction } from './NumberUtil';
import { darkMode, globalStyle } from '../model/GlobalStyles';

interface FloatStepInputProps {
  text: string;
  step: number;
  onChangeValue: (newValue: number) => void;
  value: number;
}


class FloatStepInput extends Component<FloatStepInputProps> {
  

  handleOp(operatorFn: OperatorFunction, value0: number, step0: number) {
    const result = operatorFn(value0, step0);
    this.handleInputChange(result);
  }

  handleInputChange(newValue: number) {
    this.props.onChangeValue(newValue);
  }

  render() {
    const { text, step } = this.props;
    const  value  = this.props.value;
    console.log(value);

    return (
      <View style={styles.parent}>
      <View>
        <Text style={styles.label}>{text}</Text>
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={() => this.handleOp(subtraction, value, step)}
          style={styles.subButton}
        >
          <Text style={styles.text}>-</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.handleInputChange(parseFloat(text))}
          value={value.toFixed(1)}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
        <Pressable
          onPress={() => this.handleOp(addition, value, step)}
          style={styles.addButton}
        >
          <Text style={styles.text}>+</Text>
        </Pressable>
      </View>
      </View> 
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    width: '100%'
  },
  input: {
    height: 40,
    width: 80,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    color: darkMode.fontColor,
    borderColor: darkMode.border
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: 'bold'
  },
  label: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor
  },
  subButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    backgroundColor: darkMode.accentRed,
    borderRadius: 2,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    backgroundColor: darkMode.accentGreen,
    borderRadius: 2,
  }
});

export default FloatStepInput;
