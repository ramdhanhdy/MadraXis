import { Ionicons } from '@expo/vector-icons';

// Dashboard-specific types
export interface QuickActionConfig {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    badge?: number;
    onPress: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

export interface ProgressConfig {
    label: string;
    value: number;
    variant: 'default' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    showPercentage?: boolean;
}

export interface DashboardData {
    quickActions: QuickActionConfig[];
    progressData: ProgressConfig[];
    upcomingAssignments?: Assignment[];
    todaySchedule?: ScheduleItem[];
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
}

export interface ScheduleItem {
    id: string;
    subject: string;
    time: string;
    room: string;
    teacher: string;
}