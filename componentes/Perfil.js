import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { launchImageLibrary } from 'react-native-image-picker';

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
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (result.errorCode) {
      console.log('ImagePicker Error:', result.errorMessage);
      return;
    }

    const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;

    const data = {
      file: base64Img,
      upload_preset: 'preset_publico',
      cloud_name: 'ddglrw9gv',
    };

    const res = await fetch('https://api.cloudinary.com/v1_1/ddglrw9gv/image/upload', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });

    const json = await res.json();

    if (json.secure_url) {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: json.secure_url,
      });

      setUserData(prev => ({ ...prev, photoURL: json.secure_url }));
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } else {
      Alert.alert('Erro', 'Erro ao enviar imagem.');
    }
  } catch (error) {
    console.error(error);
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
      {/* 👉 Clicável para abrir o picker */}
      <TouchableOpacity onPress={pickImageAndUpload}>
        <Image
          source={{ uri: userData.photoURL || "https://randomuser.me/api/portraits/men/75.jpg" }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.name}>{userData.nome}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <Text style={styles.idade}>ID: {userData.id || "Sem ID"}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60, backgroundColor: "#fff" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: "#333" },
  email: { fontSize: 16, color: "#666", marginTop: 4 },
  idade: { fontSize: 16, color: "#666", marginTop: 4 },
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
