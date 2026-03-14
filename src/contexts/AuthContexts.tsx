import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/api";


export interface Movimentacao {
  id_transacao: number;
  nome: string;
  valor: string;
  tipo: "GANHO" | "GASTO";
  data_transacao: string;
  categoria_id: string;
}

export interface Categoria {
  id_categoria: number; 
  nome: string;
  tipo: "GANHO" | "GASTO";
}

interface User {
  id: number; 
  nome: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signUp(nome: string, email: string, senha: string): Promise<void>;
  signOut(): Promise<void>;
  saveCategoria(nome: string, tipo: "GANHO" | "GASTO"): Promise<void>;
  saveTransacao(nome: string, valor: string, categoria_id: number, tipo: "GANHO" | "GASTO"): Promise<void>;
  listMovimentacoes(): Promise<Movimentacao[]>;
  listCategorias(): Promise<Categoria[]>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getHeaders = (tokenDeSeguranca: string | null) => ({
    "Content-Type": "application/json",
    "Authorization": tokenDeSeguranca ? `Bearer ${tokenDeSeguranca}` : "",
  });

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [storageUser, storageToken] = await Promise.all([
          AsyncStorage.getItem("@App:user"),
          AsyncStorage.getItem("@App:token"),
        ]);
        if (storageUser && storageToken) {
          setUser(JSON.parse(storageUser));
          setToken(storageToken);
        }
      } catch (error) {
        console.error("Erro ao carregar storage:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  // LOGIN
  async function signIn(email: string, senha: string) {
    const response = await fetch(`${API_URL}index.php?rota=perfil/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (data.success || data.token) {
      const rawData = data.user || data.data;
      const userData: User = {
        id: Number(rawData.id || rawData.id_perfil || rawData.perfil_id),
        nome: rawData.nome,
        email: rawData.email,
      };

      if (!userData.id) {
        throw new Error("O servidor não retornou um ID de usuário válido.");
      }

      await Promise.all([
        AsyncStorage.setItem("@App:user", JSON.stringify(userData)),
        AsyncStorage.setItem("@App:token", data.token),
      ]);

      setUser(userData);
      setToken(data.token);
      router.replace("/(auth)/home");
    } else {
      throw new Error(data.msg || data.message || "E-mail ou senha incorretos.");
    }
  }

  // CADASTRO
  async function signUp(nome: string, email: string, senha: string) {
    const response = await fetch(`${API_URL}index.php?rota=perfil/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.msg || data.message || "Erro ao cadastrar.");
  }

  // SALVAR CATEGORIA
  async function saveCategoria(nome: string, tipo: "GANHO" | "GASTO") {
    const response = await fetch(`${API_URL}index.php?rota=categoria/create`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ nome, tipo }),
    });

    const responseText = await response.text();
    console.log("[saveCategoria] RAW response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Resposta inválida do servidor: " + responseText);
    }

    if (!data.success) throw new Error(data.message || data.msg || "Erro ao criar categoria.");
  }

  // SALVAR TRANSAÇÃO (GASTO/GANHO)
  async function saveTransacao(nome: string, valor: string, categoria_id: number, tipo: "GANHO" | "GASTO") {
    if (!token) {
      throw new Error("Sessão inválida. Por favor, saia e entre novamente.");
    }

    const valorLimpo = valor.replace(",", ".").replace(/[^0-9.]/g, "");

    const response = await fetch(`${API_URL}index.php?rota=transacao/create`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({
        nome: nome,
        valor: valorLimpo,
        categoria_id: categoria_id,
      }),
    });

    const responseText = await response.text();
    console.log("[saveTransacao] RAW response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Resposta inválida do servidor: " + responseText);
    }

    if (!data.success) throw new Error(data.message || data.msg || "Erro ao salvar transação.");
  }

  // LISTAR TRANSAÇÕES
  async function listMovimentacoes(): Promise<Movimentacao[]> {
    try {
      const response = await fetch(`${API_URL}index.php?rota=transacao/list`, {
        method: "GET",
        headers: getHeaders(token),
      });
      const data = await response.json();
      return data.transacoes || data.data || (Array.isArray(data) ? data : []);
    } catch (error) {
      return [];
    }
  }

  // LISTAR CATEGORIAS
  async function listCategorias(): Promise<Categoria[]> {
    try {
      const response = await fetch(`${API_URL}index.php?rota=categoria/list`, {
        method: "GET",
        headers: getHeaders(token),
      });
      const data = await response.json();
      return data.data || (Array.isArray(data) ? data : []);
    } catch (error) {
      return [];
    }
  }

  // LOGOUT
  async function signOut() {
    try {
      await AsyncStorage.multiRemove(["@App:user", "@App:token"]);
      setUser(null);
      setToken(null);
      router.replace("/(auth)/login");
    } catch (e) {
      console.error("Erro ao deslogar:", e);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      signed: !!token && !!user, 
      user, 
      token, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      saveCategoria, 
      saveTransacao, 
      listMovimentacoes, 
      listCategorias 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);