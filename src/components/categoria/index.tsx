import React, { useState } from "react";
import { 
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, 
  ScrollView, Alert, ActivityIndicator, TouchableOpacity 
} from "react-native";
import { useRouter } from "expo-router";
import { TopBar } from "../../ui/TopBar";
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContexts";

export default function NovaCategoria() {
  const router = useRouter();
  const { saveCategoria } = useAuth();
  
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"GANHO" | "GASTO">("GASTO");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome) {
      Alert.alert("Atenção", "Digite um nome para a categoria.");
      return;
    }

    setLoading(true);
    try {
      await saveCategoria(nome, tipo);
      Alert.alert("Sucesso", "Categoria criada com sucesso!");
      
      // Volta para a tela anterior para o usuário continuar o fluxo
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(auth)/home");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível criar a categoria.");
    } finally {
      setLoading(false);
    }
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
            <Feather name="tag" size={40} color="#3498db" />
          </View>
          <Text style={styles.title}>Nova Categoria</Text>
          <Text style={styles.subtitle}>Defina o tipo e o nome da sua nova categoria</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome da Categoria</Text>
          <AppInput 
            placeholder="Ex: Alimentação, Lazer, Salário..." 
            value={nome}
            onChangeText={setNome}
            editable={!loading}
          />

          <Text style={styles.label}>Tipo de Categoria</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                tipo === "GANHO" && styles.typeButtonActiveGanho
              ]}
              onPress={() => setTipo("GANHO")}
            >
              <Feather 
                name="plus-circle" 
                size={20} 
                color={tipo === "GANHO" ? "#fff" : "#2ecc71"} 
              />
              <Text style={[styles.typeText, tipo === "GANHO" && styles.typeTextActive]}>Ganho</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.typeButton, 
                tipo === "GASTO" && styles.typeButtonActiveGasto
              ]}
              onPress={() => setTipo("GASTO")}
            >
              <Feather 
                name="minus-circle" 
                size={20} 
                color={tipo === "GASTO" ? "#fff" : "#e74c3c"} 
              />
              <Text style={[styles.typeText, tipo === "GASTO" && styles.typeTextActive]}>Gasto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonWrapper}>
            {loading ? (
              <ActivityIndicator size="large" color="#3498db" />
            ) : (
              <AppButton 
                title="Criar Categoria" 
                onPress={handleSalvar}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 24 },
  header: { alignItems: "center", marginBottom: 30 },
  iconContainer: { backgroundColor: "rgba(52, 152, 219, 0.1)", padding: 15, borderRadius: 50, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "800", color: "#2c3e50" },
  subtitle: { fontSize: 14, color: "#7f8c8d", textAlign: 'center', marginTop: 5 },
  form: { gap: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#34495e", marginBottom: 5 },
  typeContainer: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    gap: 8,
    backgroundColor: '#f9f9f9'
  },
  typeButtonActiveGanho: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  typeButtonActiveGasto: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  typeText: { fontSize: 16, fontWeight: '600', color: '#7f8c8d' },
  typeTextActive: { color: '#fff' },
  buttonWrapper: { marginTop: 20 }
});