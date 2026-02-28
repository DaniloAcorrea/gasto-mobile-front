import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { TopBar } from "../../ui/TopBar";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";
import { Feather } from "@expo/vector-icons";

export default function Ganho() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleSalvar = () => {
    // Aqui entraria a lógica de salvar no banco ou estado global
    console.log({ nome, valor, categoria });
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
            <Feather name="arrow-up-circle" size={40} color="#2ecc71" />
          </View>
          <Text style={styles.title}>Nova Entrada</Text>
          <Text style={styles.subtitle}>Preencha os dados da receita abaixo</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>O que você recebeu?</Text>
          <AppInput 
            placeholder="Ex: Salário, Venda de teclado..." 
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Valor (R$)</Text>
          <AppInput 
            placeholder="0,00" 
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />

          <Text style={styles.label}>Categoria</Text>
          <AppInput 
            placeholder="Ex: Trabalho, Investimento..." 
            value={categoria}
            onChangeText={setCategoria}
          />

          <View style={styles.buttonWrapper}>
            <AppButton 
              title="Confirmar Entrada" 
              onPress={handleSalvar}
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
    backgroundColor: "rgba(46, 204, 113, 0.1)",
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