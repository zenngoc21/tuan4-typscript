import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES } from '../data';

interface Props {
  selected?: string;
  onSelect?: (category: string) => void;
}

export function CategoryChips({ selected = 'Tất cả', onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      {CATEGORIES.map((name) => {
        const active = name === selected;
        return (
          <Pressable key={name} onPress={() => onSelect?.(name)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#FFFFFF',
  },
  chipActive: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  text: { color: '#4338CA', fontSize: 12, fontWeight: '700' },
  textActive: { color: '#FFFFFF' },
});
