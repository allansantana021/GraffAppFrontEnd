// app/(tabs)/perfil.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router'; // Para a navegação de Sair (Logout)

// --- DEFINIÇÃO DE CORES (Para consistência) ---
const COLORS = {
  primary: '#7B42F6', // Roxo (Ações)
  textDark: '#333333',
  textLight: '#777777',
  background: '#F0F0F0', // Fundo cinza claro
  cardBg: '#FFFFFF',
  border: '#EEEEEE',
  actionRed: '#FF5C39',
};

// --- DADOS MOCADOS DO USUÁRIO ---
const MOCK_USER = {
  name: 'Carlos Silva',
  email: 'carlos@graffite.com',
  avatarUrl: 'https://picsum.photos/100/100?random=10', // Imagem de placeholder
  postagens: 0,
  curtidas: 0,
  comentarios: 0,
};

// --- COMPONENTE PRINCIPAL ---
const PerfilScreen: React.FC = () => {
  const router = useRouter();
  const user = MOCK_USER;
  const hasPosts = user.postagens > 0; // Verifica se há posts para exibir

  // RF004: Lógica de simulação de Logout
  const handleLogout = () => {
    // 💡 NO FUTURO: Aqui você removeria o Token JWT (RF004)
    // Exemplo: AsyncStorage.removeItem('userToken');
    
    alert('Você saiu da sua conta.');
    
    // Redireciona para a tela de Login (app/index.tsx)
    router.replace('/'); 
  };

  // RF016: Lógica de navegação para Configurações (Personalização)
  const handleSettings = () => {
    // 💡 NO FUTURO: Aqui você navegaria para uma tela de Configurações
    alert('Navegar para Configurações (Personalização e Temas - RF016)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        
        {/* Cabeçalho de Navegação (Voltar e Configurações) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.iconBack}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          {/* RF016: Botão de Configurações */}
          <TouchableOpacity onPress={handleSettings}>
            <Text style={styles.iconSettings}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do Usuário */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user.avatarUrl }} 
            style={styles.avatar} 
          />
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          
          {/* Estatísticas */}
          <View style={styles.statsContainer}>
            <StatItem label="Postagens" value={user.postagens} />
            <StatItem label="Curtidas" value={user.curtidas} />
            <StatItem label="Comentários" value={user.comentarios} />
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            {/* RF004: Botão de Logout */}
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
            >
              <Text style={styles.logoutButtonIcon}>➡️</Text>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Área de Postagens do Usuário (RF018) */}
        <View style={styles.userPostsContainer}>
          <Text style={styles.sectionTitle}>Minhas Artes</Text>
          
          {!hasPosts ? (
            <View style={styles.noPosts}>
              <Text style={styles.noPostsText}>Nenhuma arte publicada ainda</Text>
              <Text style={styles.noPostsSubtitle}>Comece a compartilhar suas obras!</Text>
            </View>
          ) : (
            // 💡 FUTURO: Aqui entraria uma FlatList ou Grid com as postagens
            // do usuário (filtradas por ID do usuário logado - RF018)
            <Text>Mostrar lista de postagens aqui...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- COMPONENTE AUXILIAR DE ESTATÍSTICAS ---
interface StatItemProps {
    label: string;
    value: number;
}
const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBack: {
    fontSize: 24,
    color: COLORS.textDark,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  iconSettings: {
    fontSize: 22,
    color: COLORS.textDark,
  },
  // --- Profile Card ---
  profileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.cardBg,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  // --- Stats ---
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  // --- Action Buttons ---
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: COLORS.background, // Fundo cinza claro
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editButtonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.actionRed, // Borda vermelha para destaque
  },
  logoutButtonText: {
    color: COLORS.actionRed,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  logoutButtonIcon: {
      color: COLORS.actionRed,
      fontSize: 16,
  },
  // --- User Posts Section ---
  userPostsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  noPosts: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPostsText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 5,
  },
  noPostsSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default PerfilScreen;