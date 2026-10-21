import React from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './context/AuthContext';

export function Perfil({ navigation }) {
  const { user, logout } = useAuth();
  return <View style={styles.screen}>
    <Appbar.Header style={styles.header}><Appbar.BackAction onPress={() => navigation.goBack()} /><Appbar.Content title="Minha conta" /></Appbar.Header>
    <View style={styles.profileContent}>
      <Avatar.Text size={88} label={(user?.name || 'U').split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()} style={styles.profileAvatar} />
      <Text variant="headlineSmall" style={styles.profileName}>{user?.name || 'Usuário'}</Text>
      <Text style={styles.profileEmail}>{user?.email}</Text>
      <Text style={styles.profileNote}>Sua conta pode cadastrar, editar e remover conteúdos e imagens do catálogo.</Text>
      <Button mode="outlined" icon="logout" style={styles.profileButton} onPress={async () => { await logout(); navigation.navigate('Home'); }}>Sair da conta</Button>
    </View>
  </View>;
}
