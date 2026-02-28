import { View } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import ProfileContent from '../../components/profile'; // O componente que você postou acima

export default function ProfileRoute() {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <ProfileContent />
    </View>
  );
}