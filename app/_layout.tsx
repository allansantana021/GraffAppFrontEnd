// app/_layout.tsx

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, 
          statusBarTranslucent: true, 
        }} 
      />
      
      {/* Se você tiver outras rotas além do index (como o seu (tabs)/_layout.tsx), 
        elas podem ser definidas aqui ou você pode deixar apenas o Stack genérico.
      */}
      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
    </Stack>
  );
}