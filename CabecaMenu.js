import React from 'react';
import { View } from 'react-native';
import { Avatar, Button, Divider, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';
import { styles } from './css/Styles';

export function CabecalhoMenu() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const open = screen => navigation.navigate('Início', { screen });
  return <View style={styles.menuHeader}>
    <View style={styles.menuUser}>
      <Avatar.Icon size={54} icon="account" style={styles.menuAvatar} />
      <View style={styles.menuUserInfo}>
        <Text variant="titleMedium" style={styles.menuName}>{user?.name || 'Visitante'}</Text>
        <Text variant="bodySmall" style={styles.menuEmail} numberOfLines={1}>{user?.email || 'Conteúdo público'}</Text>
      </View>
    </View>
    <Divider style={styles.menuDivider} />
    {user ? <>
      <Button icon="account" contentStyle={styles.menuAction} textColor="#f2f2f5" onPress={() => open('Perfil')}>Minha conta</Button>
      <Button icon="logout" contentStyle={styles.menuAction} textColor="#f2f2f5" onPress={async () => { await logout(); navigation.closeDrawer(); }}>Sair</Button>
    </> : <Button icon="login" contentStyle={styles.menuAction} textColor="#f2f2f5" onPress={() => open('Acesso')}>Entrar / Cadastrar</Button>}
  </View>;
}
