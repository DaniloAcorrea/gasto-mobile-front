import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    // Verificação simples (ajustada para permitir entrar vazio para teste como estava no seu código)
    if (email === "" && senha === "") {
      router.replace("/home"); // O Expo Router resolve caminhos dentro de grupos (auth) automaticamente
    } else {
      Alert.alert("Erro", "Email ou senha inválidos");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo 👋</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <AppInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput
          placeholder="Senha"
          secure
          value={senha}
          onChangeText={setSenha}
        />

        <AppButton title="Entrar" onPress={handleLogin} />

        {/* Adicionado o onPress para navegar para a tela de registro */}
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>
            Não tem conta? <Text style={styles.bold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#2563eb",
  },
  bold: {
    fontWeight: "bold",
    textDecorationLine: "underline", // Um detalhe visual para parecer um link
  },
});