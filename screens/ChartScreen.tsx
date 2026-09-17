import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable, Dimensions, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { darkMode, globalStyle } from "../model/GlobalStyles";
import ExerciseUnitQueries from "../services/queries/ExerciseUnitQueries";
import { safeArray } from "../util/ArrayUtil";
import { calculatePr } from "../util/PersonalRecordsUtil";
import { formatDate } from "../util/DateUtil";
import { RootStackParamList } from "../App";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TopBarGeneral from "../components/TopBarGeneral";
import { LineChart } from "react-native-chart-kit";

type ChartScreenRouteProp = RouteProp<RootStackParamList, "Chart">;
type ChartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Chart"
>;

type ChartScreenProps = {
  route: ChartScreenRouteProp;
};

export default function ChartScreen({ route }: ChartScreenProps) {
  const navigation = useNavigation<ChartScreenNavigationProp>();
  const [filter, setFilter] = useState<"15" | "3M" | "All">("15");

  const { data: allSets } =
    ExerciseUnitQueries.listAllExerciseUnitsByName(route.params.exerciseName);

  // Calculate 1RM for each session
  const dataPoints = safeArray(allSets).map(eUnit => {
    let max1RM = 0;
    eUnit.weightAndReps.forEach(set => {
      const oneRM = calculatePr(set.weight, set.reps);
      if (oneRM > max1RM) max1RM = oneRM;
    });
    return {
      date: new Date(eUnit.date),
      value: max1RM
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Ascending order

  // Filter data
  let filteredData = dataPoints;
  if (filter === "15") {
    filteredData = dataPoints.slice(-15);
  } else if (filter === "3M") {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    filteredData = dataPoints.filter(d => d.date >= threeMonthsAgo);
  }

  // Formatting for Chart
  const chartLabels = filteredData.length > 0 ? filteredData.map(d => {
    return `${d.date.getMonth() + 1}/${d.date.getDate()}`;
  }) : ["N/A"];
  
  const chartValues = filteredData.length > 0 ? filteredData.map(d => d.value) : [0];

  const separator = (
    <View style={styles.separator} />
  );

  const elements = [
    <Pressable key="home" onPress={() => navigation.navigate('Home')}>
      <AntDesign name="left" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <View key="s1" style={styles.spacer} />,
    <Pressable key="track" onPress={() =>
      navigation.navigate("Exercise", {
        exerciseName: route.params.exerciseName,
        date: route.params.date
      })
    }>
      <Text style={styles.tabText}>Track</Text>
    </Pressable>,
    separator,
    <Pressable key="history" onPress={() =>
      navigation.navigate("History", {
        exerciseName: route.params.exerciseName,
        date: route.params.date
      })
    }>
      <Text style={styles.tabText}>History</Text>
    </Pressable>,
    separator,
    <Text key="chart" style={styles.activeTabText}>Chart</Text>,
    <View key="s2" style={styles.spacer} />,
  ];

  return (
    <View style={styles.centeredView}>
      <View style={styles.topBar}>
        <TopBarGeneral innerElements={[elements]}></TopBarGeneral>
      </View>
      
      <View style={styles.filterContainer}>
        <Pressable onPress={() => setFilter("15")} style={[styles.filterBtn, filter === "15" && styles.filterBtnActive]}>
          <Text style={[styles.filterText, filter === "15" && styles.filterTextActive]}>Last 15</Text>
        </Pressable>
        <Pressable onPress={() => setFilter("3M")} style={[styles.filterBtn, filter === "3M" && styles.filterBtnActive]}>
          <Text style={[styles.filterText, filter === "3M" && styles.filterTextActive]}>3 Months</Text>
        </Pressable>
        <Pressable onPress={() => setFilter("All")} style={[styles.filterBtn, filter === "All" && styles.filterBtnActive]}>
          <Text style={[styles.filterText, filter === "All" && styles.filterTextActive]}>All Time</Text>
        </Pressable>
      </View>

      <View style={styles.chartContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartValues
                }
              ]
            }}
            width={Math.max(Dimensions.get("window").width, chartLabels.length * 50)} // dynamic width for scroll
            height={220}
            yAxisSuffix=" kg"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: darkMode.background,
              backgroundGradientFrom: darkMode.background,
              backgroundGradientTo: darkMode.background,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`, // darkMode.accentPurple equivalent
              labelColor: (opacity = 1) => darkMode.fontColor,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: darkMode.accentPurple
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 0,
    width: "100%",
    height: "100%",
    backgroundColor: darkMode.background,
  },
  topBar: {
    width: "100%"
  },
  activeTabText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: "bold",
  },
  tabText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.5,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: darkMode.fontColor,
    opacity: 0.4,
  },
  spacer: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginVertical: 20,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: darkMode.fontColor,
  },
  filterBtnActive: {
    backgroundColor: darkMode.fontColor,
  },
  filterText: {
    color: darkMode.fontColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: darkMode.background,
  },
  chartContainer: {
    alignItems: "center",
  }
});
