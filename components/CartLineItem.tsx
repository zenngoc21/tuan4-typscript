import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CartItem } from '../data';

interface Props {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export function CartLineItem({ item, onDecrease, onIncrease, onRemove }: Props) {
  const lineTotal = item.book.price * item.quantity;

  return (
    <View style={styles.row}>
      <Image source={{ uri: item.book.cover }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.book.title}</Text>
        <Text style={styles.price}>{lineTotal.toLocaleString('vi-VN')} đ</Text>
        <View style={styles.actions}>
          <View style={styles.stepper}>
            <Pressable onPress={onDecrease} style={styles.stepButton}><Text style={styles.stepText}>−</Text></Pressable>
            <Text style={styles.qty}>{item.quantity}</Text>
            <Pressable onPress={onIncrease} style={styles.stepButton}><Text style={styles.stepText}>+</Text></Pressable>
          </View>
          <Pressable onPress={onRemove}><Text style={styles.remove}>Xoá</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  thumb: { width: 58, height: 78, borderRadius: 8, backgroundColor: '#EEF2F7' },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#111827' },
  price: { marginTop: 6, fontSize: 14, fontWeight: '800', color: '#4338CA' },
  actions: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, overflow: 'hidden' },
  stepButton: { width: 30, height: 28, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  stepText: { fontSize: 18, color: '#334155' },
  qty: { minWidth: 30, textAlign: 'center', fontWeight: '700', color: '#111827' },
  remove: { color: '#DC2626', fontSize: 12, fontWeight: '700' },
});
