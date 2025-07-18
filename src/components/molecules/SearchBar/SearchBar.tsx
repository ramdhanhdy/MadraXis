import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import styles
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  filterChips?: FilterChip[];
  onFilterChipPress?: (chipId: string) => void;
  showFilterChips?: boolean;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  filterChips = [],
  onFilterChipPress,
  showFilterChips = true,
  onClear,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={[
        styles.searchInputContainer,
        isFocused && styles.searchInputContainerFocused
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? colors.blue[500] : colors.gray[400]} 
        />
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      {showFilterChips && filterChips.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          {filterChips.map((chip) => (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.filterChip,
                chip.active && styles.filterChipActive
              ]}
              onPress={() => onFilterChipPress?.(chip.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterChipText,
                chip.active && styles.filterChipTextActive
              ]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = {
  container: {
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: spacing.sm,
  },
  searchInputContainerFocused: {
    backgroundColor: colors.white,
    borderColor: colors.blue[500],
    shadowColor: colors.blue[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    ...typography.body,
    color: colors.gray[900],
    fontSize: 16,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterChipsContainer: {
    flexDirection: 'row' as const,
  },
  filterChipsContent: {
    paddingRight: spacing.md,
  },
  filterChip: {
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 36,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  filterChipActive: {
    backgroundColor: colors.blue[500],
    borderColor: colors.blue[600],
  },
  filterChipText: {
    ...typography.caption,
    color: colors.gray[600],
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '600' as const,
  },
};

export default SearchBar;
