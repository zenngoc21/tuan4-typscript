import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BookGrid } from '../components/BookGrid';
import { CategoryChips } from '../components/CategoryChips';
import { BOOKS } from '../data';

export function CategoryScreen({ onPressBook }: { onPressBook: (id: number) => void }) {
  const [category, setCategory] = useState('Tất cả');
  const books = useMemo(() => category === 'Tất cả' ? BOOKS : BOOKS.filter((book) => book.category === category), [category]);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Danh mục sách</Text>
        <CategoryChips selected={category} onSelect={setCategory} />
        <Text style={styles.caption}>Đang xem: {category}</Text>
        <BookGrid books={books} onPressBook={onPressBook} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 100 },
  heading: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 14 },
  caption: { marginTop: 18, marginBottom: 12, fontSize: 12, color: '#64748B' },
});
