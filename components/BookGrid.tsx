import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '../data';
import { DiscountBadge } from './DiscountBadge';

export function BookGrid({ books, onPressBook }: { books: Book[]; onPressBook: (id: number) => void }) {
  return (
    <View style={styles.grid}>
      {books.map((book) => (
        <Pressable key={book.id} style={styles.item} onPress={() => onPressBook(book.id)}>
          <View style={styles.coverWrap}>
            <Image source={{ uri: book.cover }} style={styles.cover} />
            <DiscountBadge discountPercent={book.discountPercent} isNew={book.isNew} />
          </View>
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          <Text style={styles.price}>{book.price.toLocaleString('vi-VN')} đ</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: { width: '48%', marginBottom: 18 },
  coverWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#EEF2F7',
  },
  cover: { width: '100%', height: '100%' },
  title: { marginTop: 7, fontSize: 14, fontWeight: '700', color: '#111827' },
  author: { marginTop: 2, fontSize: 12, color: '#64748B' },
  price: { marginTop: 4, fontSize: 14, fontWeight: '800', color: '#4338CA' },
});
