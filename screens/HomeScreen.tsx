import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BookGrid } from '../components/BookGrid';
import { CategoryChips } from '../components/CategoryChips';
import { FloatingCartButton } from '../components/FloatingCartButton';
import { Header } from '../components/Header';
import { BOOKS } from '../data';

interface Props {
  cartCount: number;
  onPressBook: (id: number) => void;
  onPressCart: () => void;
}

export function HomeScreen({ cartCount, onPressBook, onPressCart }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');

  const filteredBooks = useMemo(() => {
    const text = query.trim().toLowerCase();
    return BOOKS.filter((book) => {
      const matchCategory = category === 'Tất cả' || book.category === category;
      const matchSearch = !text || `${book.title} ${book.author}`.toLowerCase().includes(text);
      return matchCategory && matchSearch;
    });
  }, [category, query]);

  return (
    <View style={styles.screen}>
      <Header onPressSearch={() => setSearchOpen((value) => !value)} onPressCart={onPressCart} cartCount={cartCount} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {searchOpen && (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm tên sách hoặc tác giả..."
            placeholderTextColor="#94A3B8"
            style={styles.search}
            autoFocus
          />
        )}
        <Text style={styles.title}>Sách nổi bật</Text>
        <CategoryChips selected={category} onSelect={setCategory} />
        <Text style={styles.result}>{filteredBooks.length} cuốn sách</Text>
        {filteredBooks.length > 0 ? (
          <BookGrid books={filteredBooks} onPressBook={onPressBook} />
        ) : (
          <View style={styles.empty}><Text style={styles.emptyText}>Không tìm thấy sách phù hợp.</Text></View>
        )}
      </ScrollView>
      <FloatingCartButton count={cartCount} onPress={onPressCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 160 },
  search: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 11, marginBottom: 14, color: '#111827' },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 12 },
  result: { marginTop: 18, marginBottom: 10, color: '#64748B', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: 50 },
  emptyText: { color: '#64748B' },
});
