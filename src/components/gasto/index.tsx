import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth, Categoria } from "../../contexts/AuthContexts"; 
import AppInput from "../../ui/appInput";
import AppButton from "../../ui/appButton";

export default function GastoScreen() {
  const router = useRouter();
  const { saveTransacao, listCategorias } = useAuth();
  
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await listCategorias();
        if (Array.isArray(data)) {
          const filtradas = data.filter((c: Categoria) => c.tipo === "GASTO");
          setCategorias(filtradas);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    load();
  }, []);

  const handleSalvar = async () => {
    if (!nome.trim() || !valor.trim() || !categoriaSelecionada?.id_categoria) {
      Alert.alert("Atenção", "Preencha a descrição, valor e selecione uma categoria.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Passa "GASTO" como tipo
      await saveTransacao(nome, valor, categoriaSelecionada.id_categoria, "GASTO");
      
      Alert.alert("Sucesso", "Gasto registrado com sucesso!");
      
      setNome("");
      setValor("");
      setCategoriaSelecionada(null);
      
      router.replace("/(auth)/home");
    } catch (error: any) {
      Alert.alert("Erro ao salvar", error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Feather name="arrow-down-circle" size={48} color="#e74c3c" />
          <Text style={styles.title}>Nova Saída</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>O que você comprou?</Text>
          <AppInput 
            placeholder="Ex: Mercado, Combustível..." 
            value={nome} 
            onChangeText={setNome} 
          />

          <Text style={styles.label}>Qual o valor?</Text>
          <AppInput 
            placeholder="0,00" 
            keyboardType="numeric" 
            value={valor} 
            onChangeText={setValor} 
          />

          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity 
            style={styles.picker} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: categoriaSelecionada ? "#333" : "#999" }}>
              {categoriaSelecionada ? categoriaSelecionada.nome : "Selecione uma categoria"}
            </Text>
            <Feather name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>

          <View style={{ marginTop: 20, marginBottom: 40 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#e74c3c" />
            ) : (
              <AppButton 
                title="Confirmar Gasto" 
                onPress={handleSalvar} 
                style={{ backgroundColor: "#e74c3c" }} 
              />
            )}
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            
            <FlatList 
              data={categorias}
              keyExtractor={(item) => String(item.id_categoria)}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoryItem} 
                  onPress={() => {
                    setCategoriaSelecionada(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.categoryText}>{item.nome}</Text>
                  {categoriaSelecionada?.id_categoria === item.id_categoria && (
                    <Feather name="check" size={18} color="#e74c3c" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={styles.emptyText}>Nenhuma categoria de gasto encontrada.</Text>
                  <AppButton 
                    title="Criar Categoria" 
                    onPress={() => {
                      setModalVisible(false);
                      router.push("/(auth)/categoria"); 
                    }}
                    style={{ marginTop: 15, height: 45, width: '100%', backgroundColor: '#34495e' }}
                  />
                </View>
              }
            />

            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginTop: 10 },
  form: { gap: 15 },
  label: { fontWeight: '600', color: '#34495e', marginBottom: -5 },
  picker: { 
    height: 55, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e1e8ed', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    maxHeight: '70%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#2c3e50'
  },
  categoryItem: { 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryText: { fontSize: 16, color: '#333' },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 14 },
  closeButton: { marginTop: 15, alignItems: 'center', padding: 10 },
  closeButtonText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 16 }
});