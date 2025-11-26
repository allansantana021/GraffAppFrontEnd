import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  primary: '#7B42F6',
  textDark: '#333333',
  textLight: '#777777',
  background: '#F0F0F0',
  cardBg: '#FFFFFF',
  border: '#EEEEEE',
  actionRed: '#FF5C39',
};

const MOCK_USER = {
  name: 'Carlos Silva',
  email: 'carlos@graffite.com',
  postagens: 0,
  curtidas: 0,
  comentarios: 0,
};

const PerfilScreen: React.FC = () => {
  const router = useRouter();
  const user = MOCK_USER;
  const hasPosts = user.postagens > 0;

  const [avatarUrl, setAvatarUrl] = useState<string | null>('https://picsum.photos/100/100?random=10');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleLogout = () => {
    Alert.alert('Você saiu da sua conta.');
    router.replace('/');
  };

  const handleSettings = () => {
    Alert.alert('Navegar para Configurações (Personalização e Temas - RF016)');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > 5000000) {
        Alert.alert('Imagem muito grande', 'O tamanho máximo da imagem é 5MB. Por favor, escolha outra.');
        return;
      }

      setAvatarUrl(asset.uri);
      setShowAvatarModal(false);
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar a câmera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > 5000000) {
        Alert.alert('Imagem muito grande', 'O tamanho máximo da imagem é 5MB. Por favor, tente novamente.');
        return;
      }

      setAvatarUrl(asset.uri);
      setShowAvatarModal(false);
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    }
  };

  const removePhoto = () => {
    Alert.alert('Remover foto', 'Tem certeza que deseja remover sua foto de perfil?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Remover',
        onPress: () => {
          setAvatarUrl(null);
          setShowAvatarModal(false);
          Alert.alert('Sucesso', 'Foto de perfil removida!');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.iconBack}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Text style={styles.iconSettings}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => setShowAvatarModal(true)} style={styles.avatarContainer}>
            {avatarUrl ? (
              <>
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                />
                <View style={styles.cameraIconContainer}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </View>
              </>
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.placeholderIcon}>👤</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.statsContainer}>
            <StatItem label="Postagens" value={user.postagens} />
            <StatItem label="Curtidas" value={user.curtidas} />
            <StatItem label="Comentários" value={user.comentarios} />
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonIcon}>➡️</Text>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userPostsContainer}>
          <Text style={styles.sectionTitle}>Minhas Artes</Text>

          {!hasPosts ? (
            <View style={styles.noPosts}>
              <Text style={styles.noPostsText}>Nenhuma arte publicada ainda</Text>
              <Text style={styles.noPostsSubtitle}>Comece a compartilhar suas obras!</Text>
            </View>
          ) : (
            <Text>Mostrar lista de postagens aqui...</Text>
          )}
        </View>

        <Modal
          transparent
          animationType="fade"
          visible={showAvatarModal}
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alterar foto de perfil</Text>

              <TouchableOpacity style={styles.modalButton} onPress={takePhoto}>
                <Text style={styles.modalButtonIcon}>📸</Text>
                <Text style={styles.modalButtonText}>Tirar foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                <Text style={styles.modalButtonIcon}>🖼️</Text>
                <Text style={styles.modalButtonText}>Escolher da galeria</Text>
              </TouchableOpacity>

              {avatarUrl && (
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonDanger]} onPress={removePhoto}>
                  <Text style={styles.modalButtonIcon}>🗑️</Text>
                  <Text style={[styles.modalButtonText, styles.modalButtonTextDanger]}>Remover foto</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowAvatarModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
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
  profileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.cardBg,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBg,
  },
  cameraIcon: {
    fontSize: 14,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: COLORS.background,
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
    borderColor: COLORS.actionRed,
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
  avatarPlaceholder: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 50,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  modalButtonIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  modalButtonText: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  modalButtonDanger: {
    backgroundColor: '#FFE5E5',
  },
  modalButtonTextDanger: {
    color: COLORS.actionRed,
  },
  modalButtonCancel: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonCancelText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default PerfilScreen;
