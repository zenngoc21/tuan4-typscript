import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartLineItem } from '../components/CartLineItem';
import { CartItem } from '../data';

interface Props {
  items: CartItem[];
  onIncrease: (bookId: number) => void;
  onDecrease: (bookId: number) => void;
  onRemove: (bookId: number) => void;
  onCheckout: () => void;
}

export function CartScreen({ items, onIncrease, onDecrease, onRemove, onCheckout }: Props) {
  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Giỏ hàng</Text>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptyText}>Hãy chọn một cuốn sách để bắt đầu.</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.count}>{count} sản phẩm</Text>
            {items.map((item) => (
              <CartLineItem
                key={item.book.id}
                item={item}
                onIncrease={() => onIncrease(item.book.id)}
                onDecrease={() => onDecrease(item.book.id)}
                onRemove={() => onRemove(item.book.id)}
              />
            ))}
          </ScrollView>
          <View style={styles.totalBar}>
            <View><Text style={styles.totalLabel}>Tổng cộng</Text><Text style={styles.totalValue}>{total.toLocaleString('vi-VN')} đ</Text></View>
            <Pressable style={styles.checkout} onPress={onCheckout}>
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10, fontSize: 20, fontWeight: '800', color: '#111827' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 12 },
  count: { marginBottom: 2, color: '#64748B', fontSize: 12 },
  totalBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#E5E7EB', marginBottom: 66, backgroundColor: '#FFFFFF' },
  totalLabel: { fontSize: 11, color: '#64748B' },
  totalValue: { marginTop: 2, fontSize: 18, fontWeight: '800', color: '#4338CA' },
  checkout: { backgroundColor: '#4338CA', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10 },
  checkoutText: { color: '#FFFFFF', fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { marginTop: 10, fontSize: 17, fontWeight: '800', color: '#111827' },
  emptyText: { marginTop: 6, color: '#64748B' },
});
