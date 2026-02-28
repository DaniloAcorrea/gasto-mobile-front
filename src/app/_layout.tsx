import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Garante que o login seja a primeira tela se necessário */}
      <Stack.Screen name="(auth)/login" /> 
      <Stack.Screen name="(auth)/home" />
      <Stack.Screen name="(auth)/relatorio" />
      <Stack.Screen name="(auth)/profile" />
      <Stack.Screen name="(auth)/ganho" />
      <Stack.Screen name="(auth)/gasto" />
    </Stack>
  );
}