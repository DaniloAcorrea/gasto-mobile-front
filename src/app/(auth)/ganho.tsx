import { View } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import GanhoContent from '../../components/ganho'; // O index.tsx da pasta ganho

export default function GanhoRoute() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GanhoContent />
    </View>
  );
}