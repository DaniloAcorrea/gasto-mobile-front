import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Feather } from "@expo/vector-icons";
import { useAuth, Movimentacao, Categoria } from "../../contexts/AuthContexts";

const screenWidth = Dimensions.get("window").width;

// Único donut: verde para ganhos, vermelho para gastos

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Relatorio() {
  const { listMovimentacoes, listCategorias } = useAuth();

  const now = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(now.getMonth()); // 0-11
  const [anoSelecionado, setAnoSelecionado] = useState(now.getFullYear());

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [movs, cats] = await Promise.all([
        listMovimentacoes(),
        listCategorias(),
      ]);
      setMovimentacoes(Array.isArray(movs) ? movs : []);
      setCategorias(Array.isArray(cats) ? cats : []);
    } catch (e) {
      console.error("Erro ao carregar relatório:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { carregar(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregar();
  };

  // Filtra movimentações do mês/ano selecionado
  const movDoMes = movimentacoes.filter((m) => {
    const d = new Date(m.data_transacao);
    return d.getMonth() === mesSelecionado && d.getFullYear() === anoSelecionado;
  });

  const ganhos = movDoMes.filter((m) => m.tipo === "GANHO");
  const gastos = movDoMes.filter((m) => m.tipo === "GASTO");

  const totalGanhos = ganhos.reduce((acc, m) => acc + parseFloat(m.valor || "0"), 0);
  const totalGastos = gastos.reduce((acc, m) => acc + parseFloat(m.valor || "0"), 0);
  const saldo = totalGanhos - totalGastos;

  // Monta um único donut: uma fatia verde (ganhos) e uma fatia vermelha (gastos)
  const dadosDonut = [
    ...(totalGanhos > 0 ? [{
      name: `Ganhos  ${formatBRL(totalGanhos)}`,
      population: totalGanhos,
      color: "#16a34a",
      legendFontColor: "#16a34a",
      legendFontSize: 13,
    }] : []),
    ...(totalGastos > 0 ? [{
      name: `Gastos  ${formatBRL(totalGastos)}`,
      population: totalGastos,
      color: "#dc2626",
      legendFontColor: "#dc2626",
      legendFontSize: 13,
    }] : []),
  ];

  // Percentuais para exibir no centro do donut
  const totalGeral = totalGanhos + totalGastos;
  const pctGanho = totalGeral > 0 ? Math.round((totalGanhos / totalGeral) * 100) : 0;
  const pctGasto = totalGeral > 0 ? Math.round((totalGastos / totalGeral) * 100) : 0;

  // Navegar entre meses
  const mesAnterior = () => {
    if (mesSelecionado === 0) {
      setMesSelecionado(11);
      setAnoSelecionado((a) => a - 1);
    } else {
      setMesSelecionado((m) => m - 1);
    }
  };

  const proximoMes = () => {
    if (mesSelecionado === 11) {
      setMesSelecionado(0);
      setAnoSelecionado((a) => a + 1);
    } else {
      setMesSelecionado((m) => m + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Carregando relatório...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Cabeçalho */}
      <Text style={styles.pageTitle}>Relatório</Text>

      {/* Navegação de mês */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={mesAnterior} style={styles.navBtn}>
          <Feather name="chevron-left" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MESES[mesSelecionado]} {anoSelecionado}
        </Text>
        <TouchableOpacity onPress={proximoMes} style={styles.navBtn}>
          <Feather name="chevron-right" size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Cards de resumo */}
      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardGanho]}>
          <Feather name="arrow-up-circle" size={22} color="#16a34a" />
          <Text style={styles.cardLabel}>Ganhos</Text>
          <Text style={[styles.cardValue, { color: "#16a34a" }]}>
            {formatBRL(totalGanhos)}
          </Text>
        </View>

        <View style={[styles.card, styles.cardGasto]}>
          <Feather name="arrow-down-circle" size={22} color="#dc2626" />
          <Text style={styles.cardLabel}>Gastos</Text>
          <Text style={[styles.cardValue, { color: "#dc2626" }]}>
            {formatBRL(totalGastos)}
          </Text>
        </View>
      </View>

      {/* Card saldo */}
      <View style={[styles.saldoCard, { backgroundColor: saldo >= 0 ? "#f0fdf4" : "#fff1f2" }]}>
        <Text style={styles.saldoLabel}>Saldo do mês</Text>
        <Text style={[styles.saldoValue, { color: saldo >= 0 ? "#16a34a" : "#dc2626" }]}>
          {formatBRL(saldo)}
        </Text>
      </View>

      {/* Donut único: Ganhos vs Gastos */}
      <View style={styles.chartSection}>
        <View style={styles.sectionHeader}>
          <Feather name="pie-chart" size={18} color="#2563EB" />
          <Text style={styles.sectionTitle}>Ganhos vs Gastos</Text>
        </View>

        {dadosDonut.length > 0 ? (
          <>
            <PieChart
              data={dadosDonut}
              width={screenWidth - 40}
              height={200}
              chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={true}
            />

            {/* Barra de proporção visual */}
            <View style={styles.barraContainer}>
              {totalGanhos > 0 && (
                <View style={[styles.barraParte, { flex: pctGanho, backgroundColor: "#16a34a" }]}>
                  {pctGanho >= 15 && (
                    <Text style={styles.barraTexto}>{pctGanho}%</Text>
                  )}
                </View>
              )}
              {totalGastos > 0 && (
                <View style={[styles.barraParte, { flex: pctGasto, backgroundColor: "#dc2626" }]}>
                  {pctGasto >= 15 && (
                    <Text style={styles.barraTexto}>{pctGasto}%</Text>
                  )}
                </View>
              )}
            </View>

            {/* Legenda da barra */}
            <View style={styles.barraLegenda}>
              <View style={styles.legendaItem}>
                <View style={[styles.dot, { backgroundColor: "#16a34a" }]} />
                <Text style={styles.legendaTexto}>Ganhos {pctGanho}%</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.dot, { backgroundColor: "#dc2626" }]} />
                <Text style={styles.legendaTexto}>Gastos {pctGasto}%</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyInner}>
            <Feather name="inbox" size={32} color="#9ca3af" />
            <Text style={styles.emptyText}>Nenhuma movimentação em {MESES[mesSelecionado]}</Text>
          </View>
        )}
      </View>

      {/* Lista de transações do mês */}
      {movDoMes.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Transações do mês</Text>
          {movDoMes
            .sort((a, b) => new Date(b.data_transacao).getTime() - new Date(a.data_transacao).getTime())
            .map((m) => {
              const cat = categorias.find((c) => String(c.id_categoria) === String(m.categoria_id));
              const isGanho = m.tipo === "GANHO";
              return (
                <View key={m.id_transacao} style={styles.transacaoItem}>
                  <View style={[styles.transacaoIcon, { backgroundColor: isGanho ? "#f0fdf4" : "#fff1f2" }]}>
                    <Feather
                      name={isGanho ? "arrow-up" : "arrow-down"}
                      size={16}
                      color={isGanho ? "#16a34a" : "#dc2626"}
                    />
                  </View>
                  <View style={styles.transacaoInfo}>
                    <Text style={styles.transacaoNome}>{m.nome}</Text>
                    <Text style={styles.transacaoCategoria}>{cat?.nome || "Sem categoria"}</Text>
                  </View>
                  <View style={styles.transacaoDireita}>
                    <Text style={[styles.transacaoValor, { color: isGanho ? "#16a34a" : "#dc2626" }]}>
                      {isGanho ? "+" : "-"}{formatBRL(parseFloat(m.valor || "0"))}
                    </Text>
                    <Text style={styles.transacaoData}>
                      {new Date(m.data_transacao).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f4f6f8" },
  container: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: "#6b7280", fontSize: 15 },

  pageTitle: { fontSize: 26, fontWeight: "bold", color: "#111827", marginBottom: 20 },

  // Navegação de mês
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  monthLabel: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  navBtn: { padding: 4 },

  // Cards de resumo
  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGanho: { borderTopWidth: 3, borderTopColor: "#16a34a" },
  cardGasto: { borderTopWidth: 3, borderTopColor: "#dc2626" },
  cardLabel: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  cardValue: { fontSize: 17, fontWeight: "bold" },

  // Saldo
  saldoCard: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  saldoLabel: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  saldoValue: { fontSize: 26, fontWeight: "bold" },

  // Seções de gráfico
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1f2937" },

  // Vazio dentro do card
  emptyInner: {
    paddingVertical: 30,
    alignItems: "center",
    gap: 8,
  },
  emptyText: { color: "#9ca3af", fontSize: 14 },

  // Barra de proporção
  barraContainer: {
    flexDirection: "row",
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 10,
  },
  barraParte: {
    justifyContent: "center",
    alignItems: "center",
  },
  barraTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  barraLegenda: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 4,
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendaTexto: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },

  // Lista de transações
  listSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 4,
  },
  transacaoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 12,
  },
  transacaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  transacaoInfo: { flex: 1 },
  transacaoNome: { fontSize: 14, fontWeight: "600", color: "#111827" },
  transacaoCategoria: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  transacaoDireita: { alignItems: "flex-end" },
  transacaoValor: { fontSize: 14, fontWeight: "700" },
  transacaoData: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
});