// app/(tabs)/_layout.tsx - CÓDIGO CORRIGIDO PARA ORDEM CENTRAL E SEM "INDEX"

import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// --- DEFINIÇÃO DE CORES ---
const COLORS = {
  primary: '#7B42F6',     // Roxo (ativo)
  background: '#FFFFFF',  // Branco (fundo da Tab Bar)
  textLight: '#777777',   // Cinza (inativo)
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Cores de Abas
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight, 
        tabBarStyle: {
            backgroundColor: COLORS.background,
            height: 60,
            paddingBottom: 5,
            borderTopWidth: 0, // Remove a linha de separação padrão
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        },
        headerShown: false, // Oculta o cabeçalho padrão
      }}>
      
      {/* 1. ABA INÍCIO (Seu Feed) */}
      <Tabs.Screen
        name="feed" 
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>, 
        }}
      />

      {/* 2. ABA POSTAR (Botão central grande) */}
      <Tabs.Screen
        name="postar" 
        options={{
          title: 'Postar',
          tabBarLabel: () => null, // Remove o texto 'Postar' da aba, deixando-o centralizado
          tabBarIcon: ({ focused }) => (
            <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                top: -10, // Levanta o botão acima do tab bar
            }}>
              <Text style={{ color: COLORS.background, fontSize: 30, fontWeight: 'bold' }}>+</Text>
            </View>
          ),
        }}
      />
      
      {/* 3. ABA PERFIL */}
      <Tabs.Screen
        name="perfil" 
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>,
        }}
      />
      
      {/* 💡 REMOVIDA QUALQUER REFERÊNCIA A "index" ou a outras rotas não essenciais */}
    </Tabs>
  );
}