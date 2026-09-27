import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function FloatingCartButton({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress} accessibilityLabel="Mở giỏ hàng">
      <Text style={styles.icon}>🛒</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 18,
    bottom: 82,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    paddingHorizontal: 4,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});
