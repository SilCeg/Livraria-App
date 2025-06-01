import React from 'react';
import {View, Text, Image, StyleSheet, Button} from 'react-native';

const HomeScreen = ({navigation}) => (
    <View style ={styles.container}>
        <Text>Bem-Vindo!</Text>
        <Image source={{uri:''}} style={styles.image}/>
        <Button title="Perfil" onPress={() => navigation.navigate('Perfil')}/>            
    </View>
);

const styles=StyleSheet.create({
    container: {flex:1, justifyContent:'center', alignItems:'center'},
    image: {width:150, height:150, marginTop:20}
});

export default HomeScreen;