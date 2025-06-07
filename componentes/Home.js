import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://webapptech.site/apilivraria/api/book');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

const handleDelete = async () => {
  try {
    const response = await fetch(`https://webapptech.site/apilivraria/api/book/${selectedBook.id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      Alert.alert('Sucesso', 'Livro excluído com sucesso!');
      closeModal();
      fetchBooks(); 
    } else {
      Alert.alert('Erro', 'Não foi possível excluir o livro.');
    }
  } catch (err) {
    console.error('Erro ao excluir:', err);
    Alert.alert('Erro', 'Erro inesperado ao excluir o livro.');
  }
};


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Text style={styles.bookTitle}>{item.nm_book}</Text>
      <Text style={styles.bookAuthor}>Autor: {item.autor}</Text>
      <Text style={styles.bookCategory}>Categoria: {item.category}</Text>
      <Text style={styles.bookPages}>Páginas: {item.pages_book}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bem-Vindo!</Text>
      <Image source={{ uri: '' }} style={styles.image} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}


      <Modal
        visible={!!selectedBook}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBook && (
              <>
                <Text style={styles.modalTitle}>{selectedBook.nm_book}</Text>
                <Text>Autor: {selectedBook.autor}</Text>
                <Text>Categoria: {selectedBook.category}</Text>
                <Text>Páginas: {selectedBook.pages_book}</Text>
                <Text style={styles.modalDescriptionTitle}>Descrição:</Text>
                <Text style={styles.modalDescriptionText}>{selectedBook.desc_book}</Text>

                
                <Pressable
  style={styles.actionButton}
  onPress={() => {
    closeModal();
    navigation.navigate('EditarBook', { book: selectedBook });
  }}
>
  <Text style={styles.actionButtonText}>Editar</Text>
</Pressable>

                <Pressable
                  style={[styles.actionButton, { backgroundColor: 'red' }]}
                  onPress={handleDelete}
                >
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </Pressable>

                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fabAdd}
        onPress={() => navigation.navigate('BookForm')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.fabProfile}
        onPress={() => navigation.navigate('Perfil')}
      >
        <Ionicons name="person" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 15
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10
  },
  list: {
    paddingBottom: 80
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 3
  },
  bookCategory: {
    fontSize: 14,
    marginBottom: 3
  },
  bookPages: {
    fontSize: 14,
    color: '#555'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalDescriptionTitle: {
    fontWeight: 'bold',
    marginTop: 10
  },
  modalDescriptionText: {
    fontSize: 14,
    color: '#333'
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  fabAdd: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  fabProfile: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#28A745',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  }
});

export default HomeScreen;
