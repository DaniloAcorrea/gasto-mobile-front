import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca padrão do Expo

export function TopBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Espaçador à esquerda para manter o centro equilibrado */}
      <View style={styles.sidePlaceholder} />

      {/* Grupo Central: Home e Relatório */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Text style={styles.btnText}>Home</Text>
        </TouchableOpacity>
        
        <View style={styles.divider} />

        <TouchableOpacity onPress={() => router.push('/relatorio')}>
          <Text style={styles.btnText}>Relatório</Text>
        </TouchableOpacity>
      </View>

      {/* Ícone de Perfil à Direita */}
      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={() => router.push('/profile')} // Ou o caminho correto da sua tela de perfil
      >
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingTop: 40,
    backgroundColor: '#fff',
    flexDirection: 'row', // Alinha os itens em linha
    alignItems: 'center',
    justifyContent: 'space-between', // Distribui os elementos
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidePlaceholder: {
    width: 40, // Mesmo tamanho aproximado do botão de perfil para centralizar o meio
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
  },
  btnText: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#ccc',
  },
  profileButton: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});