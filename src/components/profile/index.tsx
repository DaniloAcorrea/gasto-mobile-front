import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppButton from "../../ui/appButton";

import { useAuth } from "../../contexts/AuthContexts"; 

export default function Profile() {
  
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
      
        <Text style={styles.value}>{user?.nome || "Usuário"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || "E-mail não disponível"}</Text>
      </View>
      <AppButton
        title="Sair"
        onPress={signOut}
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
    color: "#1f2937",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});