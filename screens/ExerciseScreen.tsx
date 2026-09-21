import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import FloatStepInput from "../components/FloatStepInput";
import SwipeList from "../components/SwipeList";
import { WeightAndReps } from "../model/Category";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StorageService from "../services/storage/StorageService";
import { Selected } from "../model/Storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { darkMode, globalStyle } from "../model/GlobalStyles";
import ExerciseUnitQueries from "../services/queries/ExerciseUnitQueries";
import PersonalRecordQueries from "../services/queries/PersonalRecordQueries";
import LottieView from "lottie-react-native";
import confetti from "../assets/confetti.json";
import { calculatePr } from "../util/PersonalRecordsUtil";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { safeArray } from "../util/ArrayUtil";
import ExerciseTabBar from "../components/ExerciseTabBar";
import SelectedSetQueries from "../services/queries/SelectedSetQueries";
import Progress from "../components/Progress";

type ExerciseScreenRouteProp = RouteProp<RootStackParamList, "Exercise">;
type ExerciseScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Exercise"
>;

type ExerciseScreenProps = {
  route: ExerciseScreenRouteProp;
  navigation: ExerciseScreenNavigationProp;
};

export default function ExerciseScreen({ route }: ExerciseScreenProps) {
  const { date, exerciseName } = route.params;
  const navigation = useNavigation();
  const key = date.concat("|").concat(exerciseName);
  const { data: exerciseUnit } =
    ExerciseUnitQueries.getExerciseUnitByNameAndDate(exerciseName, date);
  const { data: prs } =
    PersonalRecordQueries.listPersonalRecordsForExercises(exerciseName);
  const confettiRef = useRef<LottieView>(null);
  const shiningRef = useRef<LottieView>(null);
  const { data: selected }: { data: Selected } = useQuery({
    queryKey: ["sets", "selected", key],
    queryFn: () => {
      return StorageService.getItem(key + "-selected");
    },
    initialData: {
      index: 0,
      unit: { weight: 0, reps: 0 },
      operation: "add",
    },
  });
  const queryClient = useQueryClient();

  const addExerciseUnit = ExerciseUnitQueries.addExerciseUnit(
    exerciseName,
    date,
    exerciseUnit,
    queryClient
  );

  const selectedSetMutation = SelectedSetQueries.selectedSetMutation(
    exerciseName,
    date,
    queryClient
  );

  const updateExerciseUnit = ExerciseUnitQueries.updateExerciseUnit(
    exerciseUnit,
    queryClient
  );

  const oneRepMax: number = Math.max(
    ...safeArray(prs).map((pr) => calculatePr(pr.weight, pr.reps))
  );
  const triggerConfetti = async () => {
    confettiRef.current?.play(0);
  };
  const triggerShining = () => {
    shiningRef.current?.play(0);
  };

  useEffect(() => {
    triggerShining();
  }, [oneRepMax]);

  const handleWeight = async (newValue: number) => {
    const unit0: WeightAndReps = {
      weight: newValue,
      reps: selected?.unit?.reps ?? 0.0,
    };
    const neco: Selected = {
      index: selected?.index ?? 0.0,
      unit: unit0,
      operation: selected?.operation ?? "add",
    };
    await selectedSetMutation.mutateAsync(neco);
  };

  const handleReps = async (newValue: number) => {
    const unit0: WeightAndReps = {
      weight: selected?.unit?.weight ?? 0.0,
      reps: newValue,
    };
    const neco: Selected = {
      index: selected?.index ?? 0.0,
      unit: unit0,
      operation: selected?.operation ?? "add",
    };
    await selectedSetMutation.mutateAsync(neco);
  };



  return (
    <>
      <View style={styles.lottie}>
        <LottieView
          ref={confettiRef}
          source={confetti}
          autoPlay={false}
          loop={false}
          style={styles.lottie}
          resizeMode="center"
        />
      </View>

      <View style={styles.centeredView}>
        <ExerciseTabBar
          activeTab="Track"
          exerciseName={route.params.exerciseName}
          date={route.params.date}
        />

        <View style={styles.header}>
          <Text style={styles.modalText}>{exerciseName}</Text>
        </View>
        <View style={styles.recordBar}>
          {/* <View style={styles.shining}>
            <LottieView
            ref={shiningRef}
            source={shining}
            autoPlay={false}
            loop={false}
            style={styles.shining}
            resizeMode='contain'
            />
          </View>  */}
          <SimpleLineIcons
            name="trophy"
            size={24}
            color={darkMode.accentGold}
          />
          {safeArray(prs).length > 0 ? (
            <Text style={styles.recordText}>{oneRepMax.toFixed(1)} kg</Text>
          ) : (
            <FontAwesome6
              name="question"
              size={16}
              color={darkMode.fontColor}
            />
          )}
        </View>
        <View style={styles.progressWrapper}>
          <Progress
            exerciseName={exerciseName}
            oneRepMax={oneRepMax}
          ></Progress>
        </View>

        <FloatStepInput
          text="Weight"
          step={2.5}
          value={selected?.unit?.weight ?? 0.0}
          onChangeValue={handleWeight}
        />
        <FloatStepInput
          text="Reps"
          step={1}
          decimals={0}
          value={selected?.unit?.reps ?? 0.0}
          onChangeValue={handleReps}
        />
        {selected != null && selected.operation === "modify" ? (
          <Pressable
            style={styles.buttonUpdate}
            onPress={async () => {
              updateExerciseUnit.mutateAsync({
                set: selected.unit,
                index: selected.index,
              });
              const backtoAdd: Selected = {
                ...selected,
                operation: "add",
              };
              await selectedSetMutation.mutateAsync(backtoAdd);
            }}
          >
            <Text style={styles.addUpdateText}>Update</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.buttonAdd}
            onPress={async () => {
              const isNewAllTimePr = (weight: number, reps: number) => {
                if (!prs) return false;
                const relevantPrs = safeArray(prs).filter(pr => pr.reps >= reps);
                if (relevantPrs.length === 0) return true;
                const maxHistoricalWeight = Math.max(...relevantPrs.map(pr => pr.weight));
                return weight > maxHistoricalWeight;
              };
              
              if (isNewAllTimePr(selected.unit.weight, selected.unit.reps)) {
                triggerConfetti();
              }
              
              await addExerciseUnit.mutateAsync(selected.unit);
            }}
          >
            <Text style={styles.addUpdateText}>Add</Text>
          </Pressable>
        )}
        <SwipeList exerciseName={exerciseName} date={date} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    width: "100%",
    height: "100%",
    backgroundColor: darkMode.background,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonAdd: {
    backgroundColor: darkMode.accentGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
    borderRadius: 5,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonUpdate: {
    backgroundColor: darkMode.accentYellow,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
    borderRadius: 5,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  addUpdateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 3,
    borderBottomColor: darkMode.border,
    borderRadius: 1,
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
    flexGrow: 4,
    textAlign: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1000,
    pointerEvents: "none",
  },
  shining: {
    marginTop: 5,
    marginLeft: 5,
    width: 64,
    height: 64,
    position: "absolute",
    zIndex: 999,
    pointerEvents: "none",
  },
  recordBar: {
    marginTop: 10,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  recordText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 15,
    textAlign: "center",
  },
  progressWrapper: {
    marginTop: 15,
  },
  topBar: {
    width: "100%"
  },
});
