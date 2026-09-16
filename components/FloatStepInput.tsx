import { useState } from "react";
import React from "react";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { addition, subtraction, OperatorFunction } from "../util/NumberUtil";
import { darkMode, globalStyle } from "../model/GlobalStyles";

interface FloatStepInputProps {
  text: string;
  step: number;
  onChangeValue: (newValue: number) => void;
  value: number;
  decimals?: number;
}

export default function FloatStepInput(props: FloatStepInputProps) {
  const { text, step, decimals = 1 } = props;
  const [value, setValue] = useState(props.value.toFixed(decimals));

  React.useEffect(() => {
    setValue(props.value.toFixed(decimals));
  }, [props.value, decimals]);

  const handleOp = (
    operatorFn: OperatorFunction,
    value0: string,
    step0: number
  ) => {
    const result = operatorFn(parseFloat(value0), step0);
    const sanitazed = result < 1 ? 1 : result;
    handleInputChange(sanitazed.toFixed(decimals));
  };

  const handleInputChange = (newValue: string) => {
    setValue(newValue);
    props.onChangeValue(parseFloat(newValue));
  };

  return (
    <View style={styles.parent}>
      <View>
        <Text style={styles.label}>{text}</Text>
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={() => handleOp(subtraction, value, step)}
          style={styles.subButton}
        >
          <Text style={styles.text}>-</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleInputChange(text)}
          value={value}
          placeholder="0"
          keyboardType="numeric"
        />
        <Pressable
          onPress={() => handleOp(addition, value, step)}
          style={styles.addButton}
        >
          <Text style={styles.text}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    width: "100%",
  },
  input: {
    height: 48,
    width: 80,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    color: darkMode.fontColor,
    borderColor: darkMode.border,
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
  },
  subButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
    backgroundColor: darkMode.accentRed,
    borderRadius: 4,
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
    backgroundColor: darkMode.accentGreen,
    borderRadius: 4,
  },
});
