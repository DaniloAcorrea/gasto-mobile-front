import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";

import { useAuth } from "../../contexts/AuthContexts"; 

export default function Login() {
  const router = useRouter();
  
 
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false); 

  async function handleLogin() {
    
    if (email.trim() === "" || senha.trim() === "") {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      
      await signIn(email, senha);
    } catch (error: any) {
      
      Alert.alert("Erro no Login", error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
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
          editable={!loading} 
        />

        <AppInput
          placeholder="Senha"
          secure
          value={senha}
          onChangeText={setSenha}
          editable={!loading}
        />

        {/* Exibe um loader se estiver carregando, senão o botão */}
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 10 }} />
        ) : (
          <AppButton title="Entrar" onPress={handleLogin} />
        )}

        <TouchableOpacity 
          onPress={() => router.push("/(auth)/register")}
          disabled={loading}
        >
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
    textDecorationLine: "underline",
  },
});