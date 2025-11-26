import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

// Importa bibliotecas necessárias
import * as ImagePicker from 'expo-image-picker';
// O import de Location foi removido, pois a funcionalidade não é mais necessária.

// --- DEFINIÇÃO DE CORES ---
const COLORS = {
  primary: '#7B42F6',
  textDark: '#333333',
  textLight: '#777777',
  background: '#F0F0F0',
  cardBg: '#FFFFFF',
  border: '#EEEEEE',
  actionRed: '#FF5C39',
};

// --- COMPONENTE PRINCIPAL ---
const PostarScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Os states de localização (locationName, coords, isLoadingLocation) foram removidos.

  // O useEffect para carregar a localização (getCurrentLocation) foi removido.
  
  // A função getCurrentLocation foi removida.

  // --- FUNÇÃO DE SELEÇÃO DE IMAGEM (RF005) ---
  const pickImage = async () => {
    // Requisita permissão de acesso à galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera/galeria para fazer upload da foto do grafite.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // RF020: Validação de imagem simulada
      const asset = result.assets[0];
      // Verificação de tamanho (simulando 5MB)
      if (asset.fileSize && asset.fileSize > 5000000) { 
        Alert.alert('Imagem muito grande', 'O tamanho máximo da imagem é 5MB. Por favor, escolha outra.');
        setImageUri(null);
        return;
      }
      setImageUri(asset.uri);
    }
  };

  // --- FUNÇÃO DE POSTAGEM (RF005) ---
  const handlePost = () => {
    // A validação de 'coords' foi removida.
    if (!imageUri || !title || !description) {
      Alert.alert('Preenchimento obrigatório', 'Por favor, selecione uma imagem, preencha o título e a descrição.');
      return;
    }

    // 💡 NO FUTURO: Aqui você faria a chamada à API (Java Spring Boot) com o JWT (RF003)
    // Usaria o 'title', 'description' e 'imageUri' para enviar o JSON/FormData.
    
    console.log('Dados prontos para envio:', { title, description, imageUri });
    
    Alert.alert('Postagem enviada!', `Seu grafite "${title}" foi enviado para o servidor.`);
    
    // Limpa o formulário após a postagem
    setImageUri(null);
    setTitle('');
    setDescription('');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Postagem</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* --- CAMPO DE IMAGEM --- */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>🖼️</Text>
              <Text style={styles.placeholderText}>Toque para selecionar a arte</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* --- CAMPO LOCALIZAÇÃO REMOVIDO AQUI --- */}
        {/* <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Localização</Text>
          ...
        </View> */}

        {/* --- CAMPO TÍTULO (RF005) --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Título da Arte</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Resistência Urbana"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* --- CAMPO DESCRIÇÃO (RF005) --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Descrição / História (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalhes sobre a obra, artista ou local..."
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />
        </View>

        {/* --- BOTÃO FINAL DE POSTAGEM --- */}
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Publicar Grafite (RF005)</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  // --- Imagem ---
  imagePicker: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    color: COLORS.textLight,
  },
  placeholderText: {
    color: COLORS.textLight,
    marginTop: 5,
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // --- Input ---
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // --- Botão de Postar ---
  postButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: COLORS.cardBg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos de localização removidos (locationContainer, locationText, refreshButton, refreshIcon)
});

export default PostarScreen;