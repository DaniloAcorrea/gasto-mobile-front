import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";


export default function Relatorio() {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório Mensal</Text>

      <BarChart
        data={{
          labels: ["Jan", "Fev", "Mar"],
          datasets: [
            {
              data: [3500, 2800, 4200],
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="R$ "
        chartConfig={{
          backgroundColor: "#2563EB",
          backgroundGradientFrom: "#2563EB",
          backgroundGradientTo: "#1e40af",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
        }}
        style={styles.chart}
      />

      <View style={styles.legendContainer}>
        <Text style={styles.income}>● Receitas</Text>
        <Text style={styles.expense}>● Despesas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  legendContainer: {
    marginTop: 20,
  },
  income: {
    color: "#16a34a",
    fontWeight: "600",
  },
  expense: {
    color: "#dc2626",
    fontWeight: "600",
  },
});