import React, { useState } from "react"; // Adicionado useState
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView 
} from "react-native";
import { useRouter } from "expo-router";
import TransactionCard from "../../ui/transactionCard";
import { Feather } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();
  // Estado para controlar a visibilidade do popup
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* --- Resumo Financeiro --- */}
      <View style={styles.summaryContainer}>
        <TouchableOpacity 
          style={[styles.summaryCard, { backgroundColor: '#2ecc71' }]}
          onPress={() => router.push('/ganho')}
        >
          <Feather name="arrow-up-circle" size={24} color="#fff" />
          <Text style={styles.summaryLabel}>Entradas</Text>
          <Text style={styles.summaryValue}>R$ 3.500,00</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.summaryCard, { backgroundColor: '#e74c3c' }]}
          onPress={() => router.push('/gasto')}
        >
          <Feather name="arrow-down-circle" size={24} color="#fff" />
          <Text style={styles.summaryLabel}>Saídas</Text>
          <Text style={styles.summaryValue}>R$ 165,00</Text>
        </TouchableOpacity>
      </View>

      {/* --- Cabeçalho da Lista --- */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Minhas Transações</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {/* --- Lista Principal (Preview) --- */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TransactionCard name="Almoço" category="Alimentação" value="45.00" date="28/02/2026" />
        <TransactionCard name="Salário" category="Receita" value="3500.00" date="01/02/2026" />
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* --- POPUP (MODAL) --- */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Histórico Completo</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Feather name="x" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.sectionTitle}>Entradas</Text>
            <TransactionCard name="Salário" category="Receita" value="3500.00" date="01/02/2026" />
            
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Saídas</Text>
            <TransactionCard name="Almoço" category="Alimentação" value="45.00" date="28/02/2026" />
            <TransactionCard name="Internet" category="Despesa Fixa" value="120.00" date="05/02/2026" />
            <TransactionCard name="Netflix" category="Lazer" value="55.90" date="10/02/2026" />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  summaryContainer: { flexDirection: "row", padding: 20, gap: 15, justifyContent: "space-between" },
  summaryCard: {
    flex: 1, padding: 15, borderRadius: 16, elevation: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  summaryLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 8 },
  summaryValue: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 15 },
  title: { fontSize: 20, fontWeight: "800", color: "#2c3e50" },
  seeAll: { color: "#3498db", fontWeight: "600" },
  scrollContent: { paddingHorizontal: 20 },
  
  // Estilos do Modal
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#2c3e50" },
  closeButton: { padding: 5 },
  modalScroll: { padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7f8c8d",
    marginBottom: 10,
    textTransform: "uppercase"
  }
});