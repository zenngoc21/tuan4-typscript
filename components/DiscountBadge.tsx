import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function DiscountBadge({ discountPercent, isNew }: { discountPercent?: number; isNew?: boolean }) {
  if (!discountPercent && !isNew) return null;

  return (
    <View style={[styles.badge, isNew ? styles.badgeNew : styles.badgeSale]}>
      <Text style={styles.text}>{isNew ? 'Mới' : `-${discountPercent}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    left: 6,
    top: 6,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  badgeSale: { backgroundColor: '#DC2626' },
  badgeNew: { backgroundColor: '#F97316' },
  text: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});
