import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';

export default function Acesso({ navigation }) {
  return <View style={styles.screen}>
    <Appbar.Header style={styles.header}><Appbar.BackAction onPress={() => navigation.goBack()} /><Appbar.Content title="Acesso" /></Appbar.Header>
    <View style={styles.accessContent}>
      <Text variant="headlineSmall" style={styles.accessTitle}>Bem-vindo!</Text>
      <Text style={styles.accessText}>Entre ou crie uma conta para gerenciar o catálogo.</Text>
      <Button mode="contained" icon="login" style={styles.accessButton} onPress={() => navigation.navigate('Login')}>Entrar</Button>
      <Button mode="outlined" icon="account-plus" style={styles.accessButton} onPress={() => navigation.navigate('Cadastro')}>Criar conta</Button>
    </View>
  </View>;
}
