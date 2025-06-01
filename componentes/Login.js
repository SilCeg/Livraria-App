import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './Firebase';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (err) {
            setError('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return(
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}/>
            <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword}/>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Entrar" onPress={handleLogin}/>
            <Button title="Cadastrar" onPress={()=> navigation.navigate('Registro')}/>    
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex:1, justifyContent: 'center', alignItems: 'center'},
    input: {width: '80%', padding: 10, borderWidth: 1, marginVertical: 5},
    error: {color: 'red'}
})

export default LoginScreen;