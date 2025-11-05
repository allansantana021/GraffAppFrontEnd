// app/index.tsx - CÓDIGO CORRIGIDO

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router'; 


const COLORS = {
  gradientStart: '#7B42F6', 
  gradientEnd: '#FF5C39', 
  
  text: '#FFFFFF',
  textDark: '#333333',
  inputBg: '#F0F0F0',
  cardBg: '#FFFFFF',
  buttonPrimary: '#000000',
  buttonText: '#FFFFFF',
  buttonSecondaryText: '#555555',
};


interface AuthButtonProps {
  label: string;
  onPress: () => void;
  isActive: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, onPress, isActive }) => (
  <TouchableOpacity
    style={[
      styles.authButton,
      isActive ? styles.authButtonActive : styles.authButtonInactive,
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.authButtonText,
        isActive
          ? styles.authButtonTextActive
          : styles.authButtonTextInactive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);


const GraffiteAuthScreen: React.FC = () => {
  
  const router = useRouter(); 
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleAuth = () => {
    
    if (email && password && (isLogin || name)) {
        
        if (isLogin) {
            console.log('Tentativa de Login:', email, password);
        } else {
            console.log('Tentativa de Cadastro:', { name, email, password });
        }
        
     
        router.replace('/feed'); 
      
        setEmail('');
        setPassword('');
        setName('');
        
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
};

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.fullScreen}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header/Topo (Adicionando um ícone placeholder para ficar mais parecido com a imagem) */}
          <View style={styles.header}>
            <Text style={styles.iconPlaceholder}>📌</Text>
            <Text style={styles.title}>Grafite App</Text>
            <Text style={styles.subtitle}>Compartilhe sua arte urbana</Text>
          </View>

          {/* Card Branco (Login/Cadastro) */}
          <View style={styles.card}>
            
            {/* Botões de Login/Cadastrar */}
            <View style={styles.authSwitchContainer}>
              <AuthButton
                label="Login"
                onPress={() => setIsLogin(true)}
                isActive={isLogin}
              />
              <AuthButton
                label="Cadastrar"
                onPress={() => setIsLogin(false)}
                isActive={!isLogin}
              />
            </View>

            {/* Campos de Input */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#AAAAAA"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#AAAAAA"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Botão de Ação */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- ESTILOS (Mesmos estilos com a correção para TextInput) ---
const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  keyboardAvoidingView: { flex: 1, justifyContent: 'flex-end' },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  iconPlaceholder: { fontSize: 40, marginBottom: 15, color: COLORS.text, backgroundColor: 'white', borderRadius: 50, padding: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  title: { fontSize: 30, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
  subtitle: { fontSize: 16, color: COLORS.text, opacity: 0.8, marginBottom: 30 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  authSwitchContainer: { flexDirection: 'row', backgroundColor: COLORS.inputBg, borderRadius: 50, padding: 4, marginBottom: 30 },
  authButton: { flex: 1, paddingVertical: 12, borderRadius: 50, alignItems: 'center' },
  authButtonActive: { backgroundColor: COLORS.cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  authButtonInactive: { backgroundColor: 'transparent' },
  authButtonText: { fontSize: 16, fontWeight: 'bold' },
  authButtonTextActive: { color: COLORS.textDark },
  authButtonTextInactive: { color: COLORS.buttonSecondaryText },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: COLORS.textDark, marginBottom: 8, fontWeight: '500' },
  input: { backgroundColor: COLORS.inputBg, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, height: 48, fontSize: 16, color: COLORS.textDark, textAlignVertical: 'center' },
  actionButton: { backgroundColor: COLORS.buttonPrimary, borderRadius: 8, paddingVertical: 15, marginTop: 20, alignItems: 'center' },
  actionButtonText: { color: COLORS.buttonText, fontSize: 18, fontWeight: 'bold' },
});

export default GraffiteAuthScreen;