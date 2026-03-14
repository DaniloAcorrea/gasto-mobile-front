import React, { useState, useCallback } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Modal, SafeAreaView, ActivityIndicator, RefreshControl 
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import TransactionCard from "../../ui/transactionCard";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContexts";

export default function Home() {
  const router = useRouter();
  const { listMovimentacoes } = useAuth(); 
  
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await listMovimentacoes();
      // Garantimos que a data seja tratada como array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  // --- LÓGICA DE FILTRO POR DATA ---
  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  // Filtros corrigidos para os nomes vindos do PHP (data_transacao)
  const recentes = transactions.filter(t => {
    const dataT = t.data_transacao || t.data;
    return dataT ? new Date(dataT) >= seteDiasAtras : false;
  });
  
  const antigas = transactions.filter(t => {
    const dataT = t.data_transacao || t.data;
    return dataT ? new Date(dataT) < seteDiasAtras : false;
  });

  // Cálculos de Resumo
  const totalEntradas = transactions
    .filter(t => t?.tipo === "GANHO")
    .reduce((acc, curr) => acc + (parseFloat(curr?.valor) || 0), 0);

  const totalSaidas = transactions
    .filter(t => t?.tipo === "GASTO")
    .reduce((acc, curr) => acc + (parseFloat(curr?.valor) || 0), 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Carregando finanças...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão para Categorias */}
      <View style={styles.categoryHeader}>
         <TouchableOpacity 
          style={styles.categoryBtn} 
          onPress={() => router.push('/(auth)/categoria')}
        >
          <Feather name="tag" size={18} color="#fff" />
          <Text style={styles.categoryBtnText}>Categorias</Text>
        </TouchableOpacity>
      </View>

      {/* Resumo Financeiro */}
      <View style={styles.summaryContainer}>
        <TouchableOpacity 
          style={[styles.summaryCard, { backgroundColor: '#2ecc71' }]} 
          onPress={() => router.push('/ganho')}
        >
          <Feather name="arrow-up-circle" size={24} color="#fff" />
          <Text style={styles.summaryLabel}>Entradas</Text>
          <Text style={styles.summaryValue}>
            R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.summaryCard, { backgroundColor: '#e74c3c' }]} 
          onPress={() => router.push('/gasto')}
        >
          <Feather name="arrow-down-circle" size={24} color="#fff" />
          <Text style={styles.summaryLabel}>Saídas</Text>
          <Text style={styles.summaryValue}>
            R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Recentes (7 dias)</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.seeAll}>Ver histórico</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      >
        {recentes.length > 0 ? (
          recentes.map((item, index) => (
            <TransactionCard 
              key={item?.id_transacao?.toString() || index.toString()}
              name={item?.nome || "Sem nome"} 
              category={item?.tipo} 
              value={item?.valor || 0} 
              date={item?.data_transacao || item?.data || "--/--/--"} 
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="clock" size={40} color="#bdc3c7" />
            <Text style={styles.emptyText}>Nenhuma atividade recente.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal Histórico */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Histórico</Text>
              <Text style={styles.modalSub}>Movimentações anteriores</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {antigas.length > 0 ? (
              antigas.map((item, index) => (
                <TransactionCard 
                  key={item?.id_transacao?.toString() || `old-${index}`}
                  name={item?.nome} 
                  category={item?.tipo} 
                  value={item?.valor} 
                  date={item?.data_transacao || item?.data} 
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Não há transações antigas.</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoryHeader: { paddingHorizontal: 20, paddingTop: 10 },
  categoryBtn: {
    backgroundColor: '#34495e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    alignSelf: 'flex-start'
  },
  categoryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  summaryContainer: { flexDirection: "row", padding: 20, gap: 15 },
  summaryCard: { flex: 1, padding: 15, borderRadius: 16, elevation: 2 },
  summaryLabel: { color: "#fff", opacity: 0.9, fontSize: 12 },
  summaryValue: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 5 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  seeAll: { color: "#3498db", fontWeight: "600" },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#bdc3c7', marginTop: 10 },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 20, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalSub: { fontSize: 12, color: '#7f8c8d' }
});