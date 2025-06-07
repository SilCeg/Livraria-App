import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

export default function Perfil({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setUserData(null);
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("Usuário não encontrado no Firestore.");
          setUserData(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  };

  const pickImageAndUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permissão necessária", "Permita acesso à galeria para alterar a foto.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const image = result.assets[0];

        const localUri = image.uri;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const mimeType = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append('file', {
          uri: localUri,
          type: mimeType,
          name: filename || 'profile.jpg',
        });
        formData.append('upload_preset', 'preset_publico'); 

        const res = await fetch('https://api.cloudinary.com/v1_1/ddglrw9gv/image/upload', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        console.log('Cloudinary response:', json);

        if (json.secure_url) {
          const user = auth.currentUser;
          await updateDoc(doc(db, 'users', user.uid), {
            fotoUrl: json.secure_url,
          });

          setUserData(prev => ({ ...prev, fotoUrl: json.secure_url }));
          Alert.alert('Sucesso', 'Foto de perfil atualizada!');
        } else {
          Alert.alert('Erro', 'Erro ao enviar imagem.');
          console.log('Erro Cloudinary:', json);
        }
      }
    } catch (error) {
      console.error('Erro geral no upload:', error);
      Alert.alert('Erro', 'Algo deu errado ao tentar fazer o upload.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImageAndUpload}>
        <Image
          source={{ uri: userData.fotoUrl || "https://randomuser.me/api/portraits/men/75.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.changePhotoText}>Clique para alterar a foto</Text>
      </TouchableOpacity>

      <Text style={styles.name}>Olá, {userData.nome}</Text>
      <Text style={styles.email}>Email: {userData.email}</Text>
      <Text style={styles.idade}> {userData.idade || "Não informado"} anos </Text>
      <Text style={styles.livro}>Livro Favorito: {userData.livroFav || "Não informado"}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60, backgroundColor: "#fff" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  changePhotoText: { fontSize: 12, color: '#555', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: "#333" },
  email: { fontSize: 16, color: "#666", marginTop: 4 },
  idade: { fontSize: 16, color: "#666", marginTop: 4 },
  livro: { fontSize: 16, color: "#666", marginTop: 4 },
  button: {
    fontSize: 16,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    width: "50%",
    marginTop: 20,
  },
  buttonText: { textAlign: "center", fontWeight: "bold", fontSize: 18 },
});
