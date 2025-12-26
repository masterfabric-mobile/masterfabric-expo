import { ThemedText } from 'masterfabric-expo-core';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Home</ThemedText>
    </SafeAreaView>
  );
}

