import { View } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import GastoContent from '../../components/gasto'; // O index.tsx da pasta gasto

export default function GastoRoute() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GastoContent />
    </View>
  );
}