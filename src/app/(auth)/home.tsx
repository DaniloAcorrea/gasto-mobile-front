import { View } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import HomeContent from '../../components/home'; // Seu index.tsx da pasta home

export default function HomeRoute() {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <HomeContent />
    </View>
  );
}