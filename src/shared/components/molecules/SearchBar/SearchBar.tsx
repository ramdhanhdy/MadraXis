import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';

// Import styles
import { spacing } from '@/src/styles/spacing';
import { typographyVariants } from '@/src/styles/typography';

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
  placeholder = 'Search expenses...',
  value,
  onChangeText,
  filterChips = [],
  onFilterChipPress,
  showFilterChips = true,
  onClear,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
          color={isFocused ? theme.colors.primary.main : theme.colors.text.secondary} 
        />
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
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
            <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
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

const createStyles = (theme: any) => ({
  container: {
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: spacing.sm,
  },
  searchInputContainerFocused: {
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    ...typographyVariants.body1,
    color: theme.colors.text.primary,
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
    backgroundColor: theme.colors.surface.secondary,
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
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.dark,
  },
  filterChipText: {
    ...typographyVariants.caption,
    color: theme.colors.text.secondary,
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: theme.colors.surface.primary,
    fontWeight: '600' as const,
  },
});

export default SearchBar;
