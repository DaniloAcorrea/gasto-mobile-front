import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContexts'; 
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { signed, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; 

    // Identifica se está no grupo autenticado
    const inAuthGroup = segments[0] === "(auth)";
    const screenName = segments[1]; 

    // Define telas públicas
    const isPublicScreen = screenName === "login" || screenName === "register";

    if (!signed && inAuthGroup && !isPublicScreen) {
      // Redireciona para login se tentar acessar algo restrito sem estar logado
      router.replace("/(auth)/login");
    } 
    else if (signed && isPublicScreen) {
      // Redireciona para home se já estiver logado
      router.replace("/(auth)/home");
    }
  }, [signed, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(auth)/home" />
      <Stack.Screen name="(auth)/ganho" />
      <Stack.Screen name="(auth)/gasto" />
      {/* ADICIONADO: Rota para a criação de categorias */}
      <Stack.Screen name="(auth)/categoria/new" /> 
      <Stack.Screen name="(auth)/profile" />
      <Stack.Screen name="(auth)/relatorio" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}