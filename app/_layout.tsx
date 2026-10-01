import '../global.css';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F7F5EF',
        },
        headerTintColor: '#174A3A',
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: '#F7F5EF',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Séries' }}
      />
      <Stack.Screen
        name="form"
        options={{ title: 'Nova série' }}
      />
      <Stack.Screen
        name="detalhe"
        options={{ title: 'Detalhes da série' }}
      />
    </Stack>
  );
}
