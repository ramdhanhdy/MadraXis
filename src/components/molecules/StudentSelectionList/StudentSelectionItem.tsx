/**
 * StudentSelectionItem Component
 * 
 * Individual student card component with selection checkbox.
 * Displays student information including name, NIS, grade level, and boarding status.
 * Provides visual feedback for selection state and optimized performance.
 */

import React, { memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../context/ThemeContext';
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
import { Avatar } from '../../atoms/Avatar';
import { StudentWithDetails } from '../../../types';
import { determineGradeLevel } from '../../../utils/dateHelpers';

// Props interface
export interface StudentSelectionItemProps {
  student: StudentWithDetails;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

// Main component
export const StudentSelectionItem: React.FC<StudentSelectionItemProps> = memo(({
  student,
  selected,
  onToggle,
  disabled = false,
  style,
  testID,
}) => {
  const colors = useColors();

  // Get container styles based on selection state
  const getContainerStyles = (): ViewStyle => {
    return {
      backgroundColor: selected 
        ? colors.primary.light + '20' // 20% opacity
        : colors.surface.primary,
      borderColor: selected 
        ? colors.primary.main 
        : colors.border.primary,
      borderWidth: selected ? 2 : 1,
      opacity: disabled ? 0.6 : 1,
    };
  };

  // Get checkbox icon based on selection state
  const getCheckboxIcon = (): keyof typeof Ionicons.glyphMap => {
    return selected ? 'checkbox' : 'square-outline';
  };

  // Get checkbox color based on selection state
  const getCheckboxColor = () => {
    if (disabled) return colors.text.disabled;
    return selected ? colors.primary.main : colors.text.secondary;
  };

  // Format student grade level
  const getGradeLevel = (): string => {
    // Use the new accurate grade level determination
    if (student.date_of_birth) {
      const gradeLevel = determineGradeLevel(student.date_of_birth);
      return gradeLevel || 'N/A';
    }
    
    // Default fallback
    return 'N/A';
  };

  // Format boarding status
  const getBoardingStatus = (): string => {
    if (student.boarding === true) return 'Boarding';
    if (student.boarding === false) return 'Day Student';
    return 'Unknown';
  };

  // Get boarding status color
  const getBoardingStatusColor = () => {
    return student.boarding ? colors.success.main : colors.info.main;
  };

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyles(), style]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${student.full_name}, ${student.nis || 'No NIS'}, ${getGradeLevel()}, ${getBoardingStatus()}`}
      testID={testID}
    >
      {/* Selection Checkbox */}
      <View style={styles.checkboxContainer}>
        <Icon
          name={getCheckboxIcon()}
          size="lg"
          color={getCheckboxColor()}
        />
      </View>

      {/* Student Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar
          name={student.full_name}
          size="md"
          // imageUrl={student.image_url} // If available
        />
      </View>

      {/* Student Information */}
      <View style={styles.infoContainer}>
        {/* Name */}
        <Typography
          variant="body1"
          color={disabled ? 'disabled' : 'primary'}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.studentName}
        >
          {student.full_name}
        </Typography>

        {/* NIS */}
        {student.nis && (
          <Typography
            variant="body2"
            color={disabled ? 'disabled' : 'secondary'}
            numberOfLines={1}
            style={styles.studentNis}
          >
            NIS: {student.nis}
          </Typography>
        )}

        {/* Grade Level and Boarding Status */}
        <View style={styles.badgeContainer}>
          {/* Grade Level Badge */}
          <View style={[styles.badge, { backgroundColor: colors.info.light }]}>
            <Typography
              variant="caption"
              color="primary"
              style={StyleSheet.flatten([styles.badgeText, { color: colors.info.main }])}
            >
              {getGradeLevel()}
            </Typography>
          </View>

          {/* Boarding Status Badge */}
          <View style={[
            styles.badge, 
            { backgroundColor: getBoardingStatusColor() + '20' }
          ]}>
            <Typography
              variant="caption"
              color="primary"
              style={StyleSheet.flatten([styles.badgeText, { color: getBoardingStatusColor() }])}
            >
              {getBoardingStatus()}
            </Typography>
          </View>
        </View>

        {/* Additional Info */}
        {student.gender && (
          <Typography
            variant="caption"
            color={disabled ? 'disabled' : 'tertiary'}
            style={styles.additionalInfo}
          >
            {student.gender === 'M' ? 'Male' : 'Female'}
            {student.date_of_birth && ` • Born ${new Date(student.date_of_birth).getFullYear()}`}
          </Typography>
        )}
      </View>

      {/* Selection Indicator */}
      {selected && (
        <View style={styles.selectionIndicator}>
          <Icon
            name="checkmark-circle"
            size="md"
            color={colors.primary.main}
          />
        </View>
      )}
    </TouchableOpacity>
  );
});

// Display name for debugging
StudentSelectionItem.displayName = 'StudentSelectionItem';

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    minHeight: 80,
  },
  checkboxContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  avatarContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  studentNis: {
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  additionalInfo: {
    marginTop: 2,
  },
  selectionIndicator: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudentSelectionItem;