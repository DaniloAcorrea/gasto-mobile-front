import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";

import { useAuth } from "../../contexts/AuthContexts"; 

export default function RegisterContent() {
  const router = useRouter();
  const { signUp } = useAuth(); 
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos para continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(nome, email, senha);
      
      Alert.alert("Sucesso", "Sua conta foi criada com sucesso!", [
        { text: "OK", onPress: () => router.replace("/(auth)/home") }
      ]);
      
    } catch (error: any) {
      Alert.alert("Erro ao cadastrar", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo para começar</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <AppInput 
            placeholder="Digite seu nome" 
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <AppInput 
            placeholder="seu@email.com" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <AppInput 
            placeholder="Crie uma senha forte" 
            secure={true} 
            value={senha}
            onChangeText={setSenha}
          />

          <View style={styles.buttonContainer}>
            {/* 4. Exibimos um loading se estiver enviando */}
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#3498db" />
            ) : (
              <AppButton 
                title="Cadastrar" 
                onPress={handleRegister} 
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Text 
              style={styles.link} 
              onPress={() => router.push("/(auth)/login")}
            >
              Faça Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 10,
    height: 50, // Reservar espaço para o loading não mover o layout
    justifyContent: 'center'
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  link: {
    color: "#3498db",
    fontWeight: "bold",
    fontSize: 14,
  },
});