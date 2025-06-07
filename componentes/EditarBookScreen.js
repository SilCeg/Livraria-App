import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const EditarBookScreen = ({ route, navigation }) => {
  const { book } = route.params;

  const [nmBook, setNmBook] = useState(book.nm_book || '');
  const [autor, setAutor] = useState(book.autor || '');
  const [category, setCategory] = useState(book.category || '');
  const [pagesBook, setPagesBook] = useState(book.pages_book?.toString() || '');
  const [descBook, setDescBook] = useState(book.desc_book || '');

const handleSalvar = async () => {
  try {
    const response = await fetch(`https://webapptech.site/apilivraria/api/book/${book.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nm_book: nmBook,
        autor,
        category,
        pages_book: pagesBook,
        desc_book: descBook
      })
    });

    if (response.ok) {
      Alert.alert('Sucesso', 'Livro atualizado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o livro.');
    }
  } catch (err) {
    console.error('Erro ao salvar:', err);
    Alert.alert('Erro', 'Erro inesperado ao atualizar o livro.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Livro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Livro"
        value={nmBook}
        onChangeText={setNmBook}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={autor}
        onChangeText={setAutor}
      />

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Páginas"
        value={pagesBook}
        onChangeText={setPagesBook}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição"
        value={descBook}
        onChangeText={setDescBook}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333'
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15
  },
  button: {
    width: '100%',
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default EditarBookScreen;
