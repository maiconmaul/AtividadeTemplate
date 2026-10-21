import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import ContentGallery from './ContentGallery';
import { styles } from './css/Styles';

export default function Pesquisa({ navigation }) {
  const [query, setQuery] = useState('');
  return <View style={styles.screen}>
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Pesquisa" />
    </Appbar.Header>
    <TextInput
      label="Pesquisar séries"
      placeholder="Digite um título, episódio ou categoria"
      value={query}
      onChangeText={setQuery}
      mode="outlined"
      left={<TextInput.Icon icon="magnify" />}
      style={styles.searchInput}
      autoCapitalize="none"
    />
    <ContentGallery query={query} />
  </View>;
}
