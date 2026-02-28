import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";

export default function RegisterContent() {
  const router = useRouter();
  
  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = () => {
    // Aqui você adicionaria a lógica de integração com sua API/Firebase
    console.log("Registrando:", { nome, email, senha });
    
    // Após o registro, normalmente enviamos o usuário para a Home ou Login
    router.replace("/home");
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
            secure={true} // Usando sua prop 'secure' do AppInput
            value={senha}
            onChangeText={setSenha}
          />

          <View style={styles.buttonContainer}>
            <AppButton 
              title="Cadastrar" 
              onPress={handleRegister} 
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Text 
              style={styles.link} 
              onPress={() => router.push("/login")}
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