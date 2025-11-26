import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
// Note: 'expo-linear-gradient' é um pacote externo e pode não estar disponível 
// em ambientes simulados, mas mantido conforme o original.
// Se necessário, substitua por View com cor sólida.
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
  errorBackground: '#FFEBEE',
  errorBorder: '#D32F2F',
  errorText: '#D32F2F',
};


// --- Componente de Botão de Alternância (Reutilizado) ---
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
    activeOpacity={0.8}
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


// --- LÓGICA DE SIMULAÇÃO DE AUTENTICAÇÃO E REDIRECIONAMENTO ---
function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simula a verificação de um token local.
    // Em uma aplicação real, aqui você faria a chamada assíncrona para checar o token/sessão.
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50)); 
      // Por padrão, definimos como false para que a tela de login apareça primeiro.
      setIsAuthenticated(false); 
      setIsReady(true);
    };
    checkAuth();
  }, []);

  // Nota: Retornamos setIsAuthenticated, embora não seja usado diretamente no Index,
  // mantemos a estrutura de um hook de autenticação real.
  return { isAuthenticated, isReady, setIsAuthenticated };
}

// --- Componente Principal (Agora unificado no Index) ---
const GraffiteAuthScreen: React.FC = () => {
  
  const router = useRouter(); 
  const { isAuthenticated, isReady } = useAuthStatus();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Se o estado de autenticação for true, redireciona imediatamente (sem mostrar a tela de login)
  if (isReady && isAuthenticated) {
    // router.replace() é crucial aqui para remover a tela de login da pilha.
    router.replace('/feed');
    return null; // Não renderiza nada enquanto redireciona
  }

  // Mostra o loading enquanto verifica a autenticação
  if (!isReady) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7B42F6" />
        </View>
    ); 
  }
  
  // Lógica de autenticação/cadastro
  const handleAuth = () => {
    setErrorMessage(null); 
    
    if (email && password && (isLogin || name)) {
        
      if (isLogin) {
        console.log('Tentativa de Login:', email, password);
      } else {
        console.log('Tentativa de Cadastro:', { name, email, password });
      }
      
      // Simulação de sucesso: Navega para o feed
      router.replace('/feed'); 
      
      setEmail('');
      setPassword('');
      setName('');
      
    } else {
      // Exibe mensagem de erro na UI (substituindo o alert)
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  // Se 'isReady' for true e 'isAuthenticated' for false, mostra a tela de Login
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
          {/* Header/Topo */}
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
                onPress={() => { setIsLogin(true); setErrorMessage(null); }}
                isActive={isLogin}
              />
              <AuthButton
                label="Cadastrar"
                onPress={() => { setIsLogin(false); setErrorMessage(null); }}
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
            
            {/* Mensagem de Erro */}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            )}

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

export default GraffiteAuthScreen;

// --- ESTILOS ---
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
  errorContainer: {
    padding: 10,
    backgroundColor: COLORS.errorBackground, 
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  errorText: {
    color: COLORS.errorText, 
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  }
});