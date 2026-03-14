import { View } from 'react-native';
import { TopBar } from '../../ui/TopBar'; // Ajuste os ../ dependendo da sua pasta
import CategoriaContent from '../../components/categoria'; // O componente que criamos antes

export default function CategoriaRoute() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CategoriaContent />
    </View>
  );
}