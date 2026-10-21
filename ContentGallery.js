import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Button, Card, IconButton, Modal, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { request, imageForm, imageUrl } from './api/client';
import { useAuth } from './context/AuthContext';
import { styles } from './css/Styles';

export function ContentCard({ item, onEdit, onDelete, isAdmin }) {
  const source = imageUrl(item.imageUrl);
  return <Card style={styles.card}>
    <Card.Title title={item.title} subtitle={item.subtitle || item.category} titleStyle={styles.cardTitle} subtitleStyle={styles.cardSubtitle} />
    {source ? <Card.Cover style={styles.cardCover} source={{ uri: source }} /> : <View style={styles.imagePlaceholder}><Text style={styles.placeholderText}>Sem imagem</Text></View>}
    <Card.Actions style={styles.cardActions}>
      <Text style={styles.categoryLabel}>{item.category}</Text>
      {isAdmin && <><IconButton icon="pencil" onPress={() => onEdit(item)} accessibilityLabel="Editar conteúdo" /><IconButton icon="delete" onPress={() => onDelete(item)} accessibilityLabel="Excluir conteúdo" /></>}
    </Card.Actions>
  </Card>;
}

export default function ContentGallery({ query = '', showCategories = false }) {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState('Séries');
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (showCategories && category) params.set('category', category);
      const queryString = params.toString();
      const result = await request(`/content${queryString ? `?${queryString}` : ''}`);
      setItems(result.items);
      if (showCategories && !query.trim()) setCategories([...new Set(result.items.map(item => item.category).filter(Boolean))]);
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }, [query, category, showCategories]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function openForm(item = null) {
    setEditing(item);
    setTitle(item?.title || '');
    setSubtitle(item?.subtitle || '');
    setFormCategory(item?.category || 'Séries');
    setImage(null);
    setRemoveImage(false);
    setVisible(true);
  }

  async function chooseImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return setMessage('Permita o acesso às fotos para escolher uma imagem.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled) { setImage(result.assets[0].uri); setRemoveImage(false); }
  }

  async function save() {
    if (!title.trim()) return setMessage('Informe o título.');
    setSaving(true);
    try {
      const form = imageForm(image, { title: title.trim(), subtitle: subtitle.trim(), category: formCategory.trim() || 'Séries', ...(removeImage ? { removeImage: 'true' } : {}) });
      await request(editing ? `/content/${editing._id}` : '/content', { method: editing ? 'PUT' : 'POST', token, body: form });
      setVisible(false);
      setMessage(editing ? 'Conteúdo atualizado.' : 'Conteúdo cadastrado.');
      await load();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  function remove(item) {
    Alert.alert('Excluir conteúdo', `Deseja excluir “${item.title}” e sua imagem?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await request(`/content/${item._id}`, { method: 'DELETE', token }); await load(); }
        catch (error) { setMessage(error.message); }
      } },
    ]);
  }

  return <View style={styles.gallery}>
    {showCategories && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
      <Button mode={category === '' ? 'contained' : 'outlined'} compact onPress={() => setCategory('')}>Todas</Button>
      {categories.map(value => <Button key={value} mode={category === value ? 'contained' : 'outlined'} compact onPress={() => setCategory(value)}>{value}</Button>)}
    </ScrollView>}
    {user && !query && <Button icon="plus" mode="contained" style={styles.addButton} onPress={() => openForm()}>Adicionar conteúdo</Button>}
    {loading ? <ActivityIndicator style={styles.loading} color="#f3ad43" /> : items.length ? <ScrollView contentContainerStyle={styles.cardsContent}>
      {items.map(item => <ContentCard key={item._id} item={item} isAdmin={!!user} onEdit={openForm} onDelete={remove} />)}
    </ScrollView> : <Text style={styles.emptyText}>{query ? 'Nenhum resultado encontrado.' : 'Ainda não há conteúdos cadastrados.'}</Text>}

    <Portal><Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
      <Text variant="titleLarge" style={styles.modalTitle}>{editing ? 'Editar conteúdo' : 'Novo conteúdo'}</Text>
      <TextInput label="Título" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Subtítulo / episódio" value={subtitle} onChangeText={setSubtitle} mode="outlined" style={styles.input} />
      <TextInput label="Categoria" value={formCategory} onChangeText={setFormCategory} mode="outlined" style={styles.input} />
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <Button icon="image-plus" mode="outlined" onPress={chooseImage} style={styles.modalButton}>{editing?.imageUrl && !image ? 'Trocar imagem' : 'Escolher imagem'}</Button>
      {editing?.imageUrl && <Button icon="image-remove" onPress={() => { setImage(null); setRemoveImage(true); }}>{removeImage ? 'Imagem será removida' : 'Remover imagem atual'}</Button>}
      <View style={styles.modalActions}><Button onPress={() => setVisible(false)}>Cancelar</Button><Button mode="contained" loading={saving} disabled={saving} onPress={save}>{editing ? 'Salvar' : 'Cadastrar'}</Button></View>
    </Modal></Portal>
    <Snackbar visible={!!message} onDismiss={() => setMessage('')} duration={3000}>{message}</Snackbar>
  </View>;
}
