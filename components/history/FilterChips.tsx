import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { FilterType } from '@/types';

interface FilterChipsProps {
  filters: Array<{ id: FilterType; label: string }>;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterChips({ 
  filters, 
  selectedFilter, 
  onFilterChange 
}: FilterChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.chip,
            selectedFilter === filter.id && styles.chipSelected
          ]}
          onPress={() => onFilterChange(filter.id)}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.chipText,
              selectedFilter === filter.id && styles.chipTextSelected
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  chip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.gray[100],
    marginRight: Layout.spacing.xs,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  chipTextSelected: {
    color: Colors.white,
  },
});