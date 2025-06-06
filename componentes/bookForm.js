import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BookForm({ navigation }) {
  const route = useRoute();
  const { id } = route.params || {}; // se existir, é edição

  const [formData, setFormData] = useState({
    nm_book: '',
    autor: '',
    category: '',
    desc_book: '',
    pages_book: ''
  });

  useEffect(() => {
    if (id) {
      fetch(`https://webapptech.site/apilivraria/api/book/${id}`)
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => {
          console.error(err);
          Alert.alert('Erro', 'Não foi possível carregar o livro.');
        });
    }
  }, [id]);

  const handleSubmit = async () => {
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `https://webapptech.site/apilivraria/api/book/${id}`
      : 'https://webapptech.site/apilivraria/api/book';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      Alert.alert('Sucesso', id ? 'Livro atualizado!' : 'Livro adicionado!');
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Livro' : 'Adicionar Livro'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Livro"
        value={formData.nm_book}
        onChangeText={(text) => setFormData({ ...formData, nm_book: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={formData.autor}
        onChangeText={(text) => setFormData({ ...formData, autor: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
      />

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Descrição"
        value={formData.desc_book}
        onChangeText={(text) => setFormData({ ...formData, desc_book: text })}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Páginas"
        value={formData.pages_book.toString()}
        onChangeText={(text) => setFormData({ ...formData, pages_book: text })}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{id ? 'Atualizar' : 'Adicionar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
