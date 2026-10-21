import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme as NavigationDarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';
import AppBar from './AppBar';
import Pesquisa from './Pesquisa';
import Acesso from './Acesso';
import Login from './Login';
import Cadastro from './Cadastro';
import { Perfil } from './Perfil';
import { CabecalhoMenu } from './CabecaMenu';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigation() {
  return <Stack.Navigator
    screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}
  >
    <Stack.Screen name="Home" component={AppBar} />
    <Stack.Screen name="Pesquisa" component={Pesquisa} />
    <Stack.Screen name="Acesso" component={Acesso} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Cadastro" component={Cadastro} />
    <Stack.Screen name="Perfil" component={Perfil} />
  </Stack.Navigator>;
}

function DrawerNavigation() {
  const { ready } = useAuth();
  if (!ready) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator color={theme.colors.primary} />
  </View>;
  return <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerStyle: { backgroundColor: theme.colors.surface },
      drawerActiveTintColor: theme.colors.primary,
      drawerInactiveTintColor: theme.colors.onSurface,
    }}
    drawerContent={props => <DrawerContentScrollView {...props}>
      <CabecalhoMenu />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>}
  >
    <Drawer.Screen name="Início" component={StackNavigation} />
  </Drawer.Navigator>;
}

function AppNavigation() {
  const navigationTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
    },
  };
  return <NavigationContainer theme={navigationTheme}><DrawerNavigation /></NavigationContainer>;
}

export default function App() {
  return <PaperProvider theme={theme}><AuthProvider><AppNavigation /></AuthProvider></PaperProvider>;
}
