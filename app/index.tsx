import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Always redirect to splash screen first
  return <Redirect href="/splash" />;
}
