import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { TopBar } from "../../ui/TopBar";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";
import { Feather } from "@expo/vector-icons";

export default function Gasto() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleSalvar = () => {
    // Lógica para salvar a despesa
    console.log("Gasto registrado:", { nome, valor, categoria });
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopBar />
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="arrow-down-circle" size={40} color="#e74c3c" />
          </View>
          <Text style={styles.title}>Nova Saída</Text>
          <Text style={styles.subtitle}>Registre seus gastos e mantenha o controle</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>O que você pagou?</Text>
          <AppInput 
            placeholder="Ex: Aluguel, Supermercado..." 
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Valor (R$)</Text>
          <AppInput 
            placeholder="0,00" 
            keyboardType="numeric" // Agora funciona com o ajuste que fizemos no AppInput!
            value={valor}
            onChangeText={setValor}
          />

          <Text style={styles.label}>Categoria</Text>
          <AppInput 
            placeholder="Ex: Lazer, Alimentação..." 
            value={categoria}
            onChangeText={setCategoria}
          />

          <View style={styles.buttonWrapper}>
            <AppButton 
              title="Confirmar Saída" 
              onPress={handleSalvar}
              // Se o seu AppButton aceitar estilo, você pode passar uma cor vermelha aqui
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: "rgba(231, 76, 60, 0.1)", // Vermelho clarinho no fundo do ícone
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: -5,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});