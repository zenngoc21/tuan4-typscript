import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  onPressSearch?: () => void;
  onPressCart?: () => void;
  cartCount?: number;
}

export function Header({ onPressSearch, onPressCart, cartCount = 0 }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>📚 BookStore</Text>
      <View style={styles.iconGroup}>
        <Pressable onPress={onPressSearch} style={styles.iconButton} accessibilityLabel="Tìm kiếm">
          <Text style={styles.icon}>🔍</Text>
        </Pressable>
        <Pressable onPress={onPressCart} style={styles.iconButton} accessibilityLabel="Giỏ hàng">
          <Text style={styles.icon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    paddingHorizontal: 16,
    backgroundColor: '#1E1B4B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  iconGroup: { flexDirection: 'row', gap: 10 },
  iconButton: { position: 'relative', padding: 4 },
  icon: { fontSize: 20 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
});
