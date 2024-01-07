import { Component } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { addition, subtraction, OperatorFunction } from './NumberUtil';

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
      
        <Button
          title="-"
          onPress={() => this.handleOp(subtraction, value, step)}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.handleInputChange(parseFloat(text))}
          value={value.toFixed(1)}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
        <Button
          title="+"
          onPress={() => this.handleOp(addition, value, step)}
        />
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
    borderWidth: 1,
    padding: 10,
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1
  },
  label: {
    marginTop: 10,
    textAlign: 'center'
  }
});

export default FloatStepInput;
