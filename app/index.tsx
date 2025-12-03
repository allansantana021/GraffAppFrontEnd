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
  Image, // <-- Importado o componente Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; 


// Define a URL para o ícone de grafite
const GRAFFITI_ICON_URL = 'http://googleusercontent.com/image_generation_content/0';

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
  successBackground: '#E8F5E9', 
  successText: '#388E3C',       
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
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50)); 
      setIsAuthenticated(false); 
      setIsReady(true);
    };
    checkAuth();
  }, []);

  return { isAuthenticated, isReady, setIsAuthenticated };
}

// --- Componente Principal (Agora unificado no Index) ---
const GraffiteAuthScreen: React.FC = () => {
  
  const router = useRouter(); 
  const { isAuthenticated, isReady } = useAuthStatus();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(''); // Estado para o nome do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NOVO ESTADO: Confirmação de senha
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  // Se o estado de autenticação for true, redireciona imediatamente
  if (isReady && isAuthenticated) {
    router.replace('/feed');
    return null; 
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
    setSuccessMessage(null);
    
    // 1. Validação básica (campos preenchidos)
    // No modo cadastro, exige nome, email, senha E a confirmação de senha
    if (!email || !password || (!isLogin && (!name || !confirmPassword))) { // Verifica se o campo 'name' foi preenchido no modo cadastro
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // 2. Validação de Confirmação de Senha (apenas no modo Cadastro)
    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('A senha e a confirmação de senha não são idênticas.');
      return;
    }
    
    // Simulação de sucesso da requisição (Em um app real, faria a chamada API aqui)
    if (isLogin) {
      // --- CÓDIGO PARA LOGIN BEM-SUCEDIDO ---
      console.log('Login bem-sucedido:', email);
      router.replace('/feed'); 
      
    } else {
      // --- CÓDIGO PARA CADASTRO BEM-SUCEDIDO ---
      console.log('Cadastro bem-sucedido:', { name, email, password });
      
      // Alterna para o modo Login
      setIsLogin(true); 
      // Avisa o usuário que o cadastro foi um sucesso
      setSuccessMessage('Cadastro realizado com sucesso! Faça login para continuar.');
      // Limpa campos
      setPassword(''); 
      setConfirmPassword(''); // Limpa a confirmação
      setName('');
    }
  };

  // Funções para limpar mensagens ao alternar modo
  const handleSwitchMode = (isLoginMode: boolean) => {
    setIsLogin(isLoginMode);
    setErrorMessage(null); 
    setSuccessMessage(null);
    setConfirmPassword(''); // Limpa a confirmação ao trocar
  };


  // Se 'isReady' for true e 'isAuthenticated' for false, mostra a tela de Login/Cadastro
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
            {/* ÍCONE SUBSTITUÍDO PELA IMAGEM DE GRAFITE */}
            <Image 
              source={{ uri: GRAFFITI_ICON_URL }} 
              style={styles.iconImage} // Novo estilo
            />
            <Text style={styles.title}>Grafite App</Text>
            <Text style={styles.subtitle}>Compartilhe sua arte urbana</Text>
          </View>

          {/* Card Branco (Login/Cadastro) */}
          <View style={styles.card}>
            
            {/* Botões de Login/Cadastrar */}
            <View style={styles.authSwitchContainer}>
              <AuthButton
                label="Login"
                onPress={() => handleSwitchMode(true)}
                isActive={isLogin}
              />
              <AuthButton
                label="Cadastrar"
                onPress={() => handleSwitchMode(false)}
                isActive={!isLogin}
              />
            </View>

            {/* Mensagem de Erro/Sucesso */}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            )}
            
            {successMessage && (
                <View style={styles.successContainer}>
                    <Text style={styles.successText}>🎉 {successMessage}</Text>
                </View>
            )}

            {/* Campos de Input (Nome, Email, Senha, Confirmação) */}
            {!isLogin && ( // Campo Nome aparece apenas no modo Cadastro
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo ou nome de usuário"
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
            
            {/* NOVO CAMPO: Confirmação de Senha (Apenas no modo Cadastro) */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirme a Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#AAAAAA"
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
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
  // NOVO ESTILO PARA A IMAGEM
  iconImage: {
    width: 100, 
    height: 100, 
    marginBottom: 15, 
    borderRadius: 15, 
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
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
  successContainer: { 
    padding: 10,
    backgroundColor: COLORS.successBackground, 
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.successText,
  },
  successText: {
    color: COLORS.successText, 
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