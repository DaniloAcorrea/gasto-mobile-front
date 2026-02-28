import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppButton from "../../ui/appButton";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>Danilo</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>danilo@email.com</Text>
      </View>

      <AppButton
        title="Sair"
        onPress={() => console.log("Logout")}
      />
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
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});