import React from 'react';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { styles } from './css/Styles';
import ContentGallery from './ContentGallery';
import { useAuth } from './context/AuthContext';

const AppBar = ({ navigation }) => {
  const { user } = useAuth();
  return <View style={styles.screen}>
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" onPress={() => navigation.getParent()?.openDrawer()} accessibilityLabel="Abrir menu" />
      <Appbar.Content title="Technologic" titleStyle={styles.appTitle} />
      <Appbar.Action icon="magnify" onPress={() => navigation.navigate('Pesquisa')} accessibilityLabel="Pesquisar" />
      <Appbar.Action icon={user ? 'account-check' : 'account'} onPress={() => navigation.navigate(user ? 'Perfil' : 'Acesso')} accessibilityLabel="Conta" />
    </Appbar.Header>
    <View style={styles.hero}><Text variant="headlineSmall" style={styles.heroTitle}>Séries para assistir</Text><Text style={styles.heroSubtitle}>Descubra e acompanhe suas histórias favoritas.</Text></View>
    <ContentGallery showCategories />
  </View>;
};

export default AppBar;
