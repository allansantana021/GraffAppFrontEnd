// app/(tabs)/postar.tsx

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';

// Importa bibliotecas necessárias
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

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
  const [locationName, setLocationName] = useState('Obtendo localização...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // --- FUNÇÃO DE OBTENÇÃO DE LOCALIZAÇÃO (RF005) ---
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setLocationName('Permissão de localização negada.');
      setIsLoadingLocation(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Converte coordenadas para um endereço legível (geocoding)
      let reverse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const city = reverse[0]?.city || reverse[0]?.subregion || 'Local Desconhecido';
      const street = reverse[0]?.street || 'Rua Desconhecida';
      
      setLocationName(`${street}, ${city}`);
      
    } catch (error) {
      setLocationName('Erro ao obter localização.');
      console.error('Location Error:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Carrega a localização assim que a tela abre
  useEffect(() => {
    getCurrentLocation();
  }, []);

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
      if (asset.fileSize && asset.fileSize > 5000000) { // Exemplo: 5MB
          Alert.alert('Imagem muito grande', 'O tamanho máximo da imagem é 5MB. Por favor, escolha outra.');
          setImageUri(null);
          return;
      }
      setImageUri(asset.uri);
    }
  };

  // --- FUNÇÃO DE POSTAGEM (RF005) ---
  const handlePost = () => {
    if (!imageUri || !title || !description || !coords) {
      Alert.alert('Preenchimento obrigatório', 'Por favor, selecione uma imagem, preencha o título, a descrição e aguarde a localização ser obtida.');
      return;
    }

    // 💡 NO FUTURO: Aqui você faria a chamada à API (Java Spring Boot) com o JWT (RF003)
    // Usaria o 'title', 'description', 'imageUri' e 'coords' para enviar o JSON/FormData.
    
    console.log('Dados prontos para envio:', { title, description, coords, imageUri });
    
    Alert.alert('Postagem enviada!', `Seu grafite "${title}" foi enviado para o servidor.`);
    
    // Limpa o formulário após a postagem
    setImageUri(null);
    setTitle('');
    setDescription('');
    getCurrentLocation(); // Atualiza a localização novamente
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

        {/* --- CAMPO LOCALIZAÇÃO (RF005) --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Localização</Text>
          <View style={styles.locationContainer}>
             {isLoadingLocation ? (
                 <ActivityIndicator size="small" color={COLORS.primary} />
             ) : (
                <Text style={styles.locationText}>{locationName}</Text>
             )}
             {/* Botão de Atualizar Localização */}
             <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshButton}>
                <Text style={styles.refreshIcon}>🔄</Text>
             </TouchableOpacity>
          </View>
        </View>

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
  // --- Localização ---
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.textDark,
    flex: 1,
  },
  refreshButton: {
      padding: 5,
  },
  refreshIcon: {
      fontSize: 18,
      color: COLORS.primary,
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
});

export default PostarScreen;