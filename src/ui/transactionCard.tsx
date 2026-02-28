import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  name: string;
  value: string;
  category: string;
  date: string;
}

export default function TransactionCard({
  name,
  value,
  category,
  date,
}: Props) {
  const isIncome = category.toLowerCase() === "receita";

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>

      <View style={styles.right}>
        <Text
          style={[
            styles.value,
            { color: isIncome ? "#16a34a" : "#dc2626" },
          ]}
        >
          {isIncome ? "+" : "-"} R$ {value}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 13, color: "#777" },
  right: { alignItems: "flex-end" },
  value: { fontSize: 16, fontWeight: "bold" },
  date: { fontSize: 12, color: "#999" },
});