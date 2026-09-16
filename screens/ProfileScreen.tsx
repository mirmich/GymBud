import React from "react";
import { View, StyleSheet, TextInput, Text, Pressable } from "react-native";
import { darkMode, globalStyle } from "../model/GlobalStyles";
import SelectDropdown from "react-native-select-dropdown";
import ProfileQueries from "../services/queries/ProfileQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TopBarGeneral from "../components/TopBarGeneral";

export default function ProfileScreen() {
  const navigation = useNavigation();
  //const [age, onChangeAge] = React.useState('');
  //const [bodyWeight, onChangeNodyWeight] = React.useState('');
  const genders = ["Male", "Female"];
  const queryClient = useQueryClient();

  const { data: age } = ProfileQueries.getProfileProperty("age");
  const { data: bodyWeight } = ProfileQueries.getProfileProperty("bodyWeight");
  const { data: gender } = ProfileQueries.getProfileProperty("gender");

  const bodyWeightMutation = ProfileQueries.makeMutation(
    "bodyWeight",
    queryClient
  );
  const ageMutation = ProfileQueries.makeMutation("age", queryClient);
  const genderMutation = ProfileQueries.makeMutation("gender", queryClient);

  const prepareNumberProp = (newValue: string) => {
    if (newValue == null) {
      return "";
    } else {
      return newValue;
    }
  };
  const prepareGenderProp = (newValue: string) => {
    if (newValue == null) {
      return "Male";
    } else {
      return newValue;
    }
  };

  const backElements = [
    <Pressable onPress={() => navigation.navigate('Home')}>
      <AntDesign name="left" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <Text style={styles.titleText}>Profile</Text>,
    <View style={styles.spacer} />,
  ];

  return (
    <View style={styles.outerView}>
      <TopBarGeneral innerElements={[backElements]}></TopBarGeneral>
      {/* <TopBarPlain></TopBarPlain> */}
    <View style={styles.centeredView}>
      <View>
        <View style={styles.profilePhotoView}>
          <Feather name="user" size={52} color={darkMode.fontColor} />
        </View>
        <Text style={styles.text}>Gender</Text>
        <SelectDropdown
          data={genders}
          defaultValue={prepareGenderProp(gender)}
          buttonStyle={styles.input}
          buttonTextStyle={styles.dropdownText}
          onSelect={async (selectedItem) => {
            await genderMutation.mutateAsync(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
      </View>
      <View>
        <Text style={styles.text}>Age</Text>
        <TextInput
          style={styles.input}
          onChangeText={ageMutation.mutateAsync}
          value={prepareNumberProp(age)}
          placeholder="Age"
          keyboardType="numeric"
        />
      </View>
      <View>
        <Text style={styles.text}>Weight</Text>
        <TextInput
          style={styles.input}
          onChangeText={bodyWeightMutation.mutateAsync}
          value={prepareNumberProp(bodyWeight)}
          placeholder="Weight"
          keyboardType="numeric"
        />
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    backgroundColor: darkMode.background,
  },
  centeredView: {
    paddingTop: 10,
    width: "100%",
    flex: 1,
    backgroundColor: darkMode.background,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profilePhotoView: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    height: 50,
    width: 200,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    backgroundColor: darkMode.background,
    color: darkMode.fontColor,
    borderColor: darkMode.border,
  },
  text: {
    color: darkMode.fontColor,
  },
  dropdownText: {
    color: darkMode.fontColor,
    textAlign: "left",
    fontSize: 14,
  },
  titleText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: "bold",
  },
  spacer: {
    flex: 1,
  },
});
