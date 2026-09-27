import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TabKey = 'home' | 'category' | 'cart' | 'account';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Trang chủ', icon: '🏠' },
  { key: 'category', label: 'Danh mục', icon: '📂' },
  { key: 'cart', label: 'Giỏ hàng', icon: '🛒' },
  { key: 'account', label: 'Tài khoản', icon: '👤' },
];

export function TabBar({ active, onChange, cartCount }: { active: TabKey; onChange: (key: TabKey) => void; cartCount: number }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Pressable key={tab.key} style={styles.item} onPress={() => onChange(tab.key)}>
            <View>
              <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
              {tab.key === 'cart' && cartCount > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 66,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
  },
  item: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 2 },
  icon: { fontSize: 18, opacity: 0.55 },
  iconActive: { opacity: 1 },
  label: { fontSize: 11, color: '#94A3B8' },
  labelActive: { color: '#4338CA', fontWeight: '800' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
});
