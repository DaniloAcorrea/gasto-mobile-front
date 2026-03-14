import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface TransactionCardProps {
  name: string;
  category: "GANHO" | "GASTO" | string;
  value: string | number;
  date: string;
}

export default function TransactionCard({ name, category, value, date }: TransactionCardProps) {
  // Verificação de segurança para não quebrar se os dados vierem vazios
  const isGanho = category === "GANHO";
  const color = isGanho ? "#2ecc71" : "#e74c3c";
  const icon = isGanho ? "arrow-up-circle" : "arrow-down-circle";
  const prefix = isGanho ? "+ " : "- ";

  // Formata o valor com segurança
  const formattedValue = parseFloat(String(value || 0)).toLocaleString('pt-BR', { 
    minimumFractionDigits: 2 
  });

  return (
    <View style={styles.card}>
      {/* Esquerda: Ícone */}
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Feather name={icon} size={24} color={color} />
      </View>

      {/* Meio: Nome da transação */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name || "Sem título"}
        </Text>
      </View>

      {/* Direita: Valor e Data embaixo */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: color }]}>
          {prefix}R$ {formattedValue}
        </Text>
        <Text style={styles.dateText}>
          {date || "--/--/--"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  info: { 
    flex: 1 
  },
  name: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#2c3e50" 
  },
  valueContainer: { 
    alignItems: "flex-end",
    justifyContent: "center"
  },
  value: { 
    fontSize: 15, 
    fontWeight: "bold" 
  },
  dateText: { 
    fontSize: 11, 
    color: "#95a5a6", 
    marginTop: 2,
    fontWeight: "500"
  },
});