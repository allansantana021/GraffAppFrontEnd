// app/(tabs)/feed.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Você precisará instalar ou usar o Expo Vector Icons para ícones melhores,
// mas vamos usar emojis por enquanto para garantir a funcionalidade.

// --- DEFINIÇÃO DE CORES ---
const COLORS = {
  primary: '#7B42F6', // Roxo (Cor principal)
  textDark: '#333333',
  textLight: '#777777',
  background: '#F0F0F0', // Fundo cinza claro
  cardBg: '#FFFFFF',
  actionRed: '#FF5C39',
  separator: '#EEEEEE', // Cor para o coração (curtida)
};

// --- TIPAGENS ---
interface Post {
  id: string;
  user: string;
  date: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  location: string;
  likes: number;
  comments: number;
}

// --- DADOS MOCADOS (Simulando o que você enviou) ---
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: 'Carlos Silva',
    date: '01/11/2025',
    userAvatar: 'https://picsum.photos/50/50?random=1', // Avatar do usuário
    // 💡 NOVA IMAGEM 1: Simula um grafite colorido com formas
    imageUrl: 'https://grafftrade.com.br/wp-content/uploads/2025/01/grafite-profissional-loja-roupa.jpg', 
    caption: 'Resistência Urbana: o muro fala por si.',
    location: 'Avenida Paulista, São Paulo - SP',
    likes: 127,
    comments: 2,
  },
  {
    id: '2',
    user: 'Ana Costa',
    date: '30/10/2025',
    userAvatar: 'https://picsum.photos/50/50?random=2', // Avatar do usuário
    // 💡 NOVA IMAGEM 2: Simula um grafite com close-up de letras ou rosto
    imageUrl: 'https://cdn.culturagenial.com/imagens/grafite-gemeos-boston-20120808-01-original-cke.jpg?class=article',
    caption: 'Arte de rua em dia de sol. Cores vibrantes!',
    location: 'Beco do Batman, Vila Madalena - SP',
    likes: 450,
    comments: 15,
  },
  {
    id: '3',
    user: 'MundoCinza',
    date: '28/10/2025',
    userAvatar: 'https://picsum.photos/50/50?random=3', // Avatar do usuário
    // 💡 NOVA IMAGEM 3: Simula um grafite em preto e branco ou stencil
    imageUrl: 'https://fiosdenylon.com.br/wp-content/uploads/2020/06/grafite-em-tapume01.webp', 
    caption: 'Stencil simples e direto. Mensagem entregue.',
    location: 'Lapa, Rio de Janeiro - RJ',
    likes: 88,
    comments: 5,
  },
];
// --- COMPONENTE DE UMA ÚNICA POSTAGEM ---
const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <View style={styles.postCard}>
      {/* Cabeçalho da Postagem */}
      <View style={styles.postHeader}>
        <Image 
          source={{ uri: post.userAvatar }} 
          style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user}</Text>
          <Text style={styles.date}>{post.date}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>...</Text> 
        </TouchableOpacity>
      </View>

      {/* Imagem da Postagem */}
      <Image 
        source={{ uri: post.imageUrl }} 
        style={styles.postImage} 
        resizeMode="cover"
      />

      {/* Footer de Interações */}
      <View style={styles.postInteractions}>
        <View style={styles.interactionGroup}>
          <Text style={styles.interactionIcon}>❤️</Text>
          <Text style={styles.interactionCount}>{post.likes}</Text>
        </View>
        <View style={styles.interactionGroup}>
          <Text style={styles.interactionIcon}>💬</Text>
          <Text style={styles.interactionCount}>{post.comments}</Text>
        </View>
      </View>
      
      {/* Legenda e Localização */}
      <View style={styles.postDetails}>
        <Text style={styles.captionText}>
          <Text style={styles.captionBold}>{post.caption}</Text>
          {/* Aqui você adicionaria o restante da descrição se houvesse */}
        </Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{post.location}</Text>
        </View>
      </View>
    </View>
  );
};

// --- COMPONENTE PRINCIPAL (FeedScreen) ---
const FeedScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>GraffiteApp</Text>
        <TouchableOpacity>
          <Text style={styles.appIcon}>🔗</Text> {/* Simula o ícone de link ou configurações */}
        </TouchableOpacity>
      </View>
      <FlatList
        data={MOCK_POSTS}
        renderItem={({ item }) => <PostItem post={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: StatusBar.currentHeight,
  },
  listContent: {
    paddingBottom: 20, // Espaço no final da lista
  },
  // -- Estilos do Cabeçalho Global (GraffiteApp) --
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  appIcon: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  // -- Estilos do Card de Postagem --
  postCard: {
    backgroundColor: COLORS.cardBg,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  moreButton: {
    padding: 5,
  },
  moreButtonText: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  postImage: {
    width: '100%',
    height: 300, // Altura fixa para a imagem. Ajuste conforme necessário
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // -- Estilos de Interação --
  postInteractions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  interactionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  interactionIcon: {
    fontSize: 20,
    marginRight: 5,
    // Emojis
    color: COLORS.actionRed, // Cor do coração
  },
  interactionCount: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  // -- Detalhes e Localização --
  postDetails: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  captionText: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    marginBottom: 5,
  },
  captionBold: {
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});

export default FeedScreen;