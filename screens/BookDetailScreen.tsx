import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Book } from '../data';

interface Props {
  book: Book;
  onBack: () => void;
  onAddToCart: () => void;
}

export function BookDetailScreen({ book, onBack, onAddToCart }: Props) {
  return (
    <View style={styles.screen}>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Quay lại</Text></Pressable>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: book.cover }} style={styles.cover} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author} · {book.category}</Text>
        <Text style={styles.price}>{book.price.toLocaleString('vi-VN')} đ</Text>
        <Text style={styles.section}>Mô tả</Text>
        <Text style={styles.description}>{book.description}</Text>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View><Text style={styles.small}>Giá bán</Text><Text style={styles.bottomPrice}>{book.price.toLocaleString('vi-VN')} đ</Text></View>
        <Pressable style={styles.button} onPress={onAddToCart}><Text style={styles.buttonText}>Thêm vào giỏ</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  back: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { color: '#4338CA', fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  cover: { alignSelf: 'center', width: '72%', aspectRatio: 3 / 4, borderRadius: 12, backgroundColor: '#EEF2F7' },
  title: { marginTop: 18, fontSize: 22, fontWeight: '800', color: '#111827' },
  author: { marginTop: 5, fontSize: 13, color: '#64748B' },
  price: { marginTop: 12, fontSize: 19, fontWeight: '800', color: '#4338CA' },
  section: { marginTop: 22, marginBottom: 7, fontSize: 15, fontWeight: '800', color: '#111827' },
  description: { fontSize: 14, lineHeight: 22, color: '#374151' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  small: { fontSize: 11, color: '#64748B' },
  bottomPrice: { marginTop: 2, fontSize: 16, fontWeight: '800', color: '#4338CA' },
  button: { backgroundColor: '#4338CA', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
});
