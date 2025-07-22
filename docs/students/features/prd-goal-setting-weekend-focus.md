# Product Requirements Document: Student Goal-Setting Feature - Weekend Focus

## Product Overview

The MadraXis Student Goal-Setting Feature is a specialized module designed for boarding school students who have limited phone access, typically only on weekends. This feature enables students to set weekly academic and spiritual goals using the SMART framework, reflect on their progress, and develop consistent study habits despite restricted device access.

## Problem Statement

Boarding school students face unique challenges in maintaining consistent academic goal-setting and progress tracking due to limited phone access during weekdays. Existing goal-setting and study apps are designed for daily engagement and don't accommodate the weekend-only access pattern common in boarding schools. Students need a system that works within these constraints while helping them maintain academic focus and spiritual growth throughout the week.

## Target Audience

### Primary Users
Junior and senior high school boarding students (ages 13-18)

### User Segments
- **Motivated students**: Seeking structured goal-setting tools
- **Unmotivated students**: Need guidance and encouragement

### Key Characteristics
- Limited phone access (weekends only)
- Need for academic and Qur'an memorization tracking
- Require privacy in their goal-setting activities
- Benefit from reduced social media exposure during weekdays

## Key Features and Functionalities

### Core Features

#### 1. SMART Goal Setting System
- Academic targets with assignment completion tracking
- Qur'an memorization goals
- Weekly goal creation and modification

#### 2. Weekend Reflection Feature
- Weekly progress review
- Achievement assessment
- Next week's goal planning

#### 3. Note-Taking Guidance
- Instructions for effective paper-based note-taking
- Cornell Notes methodology
- Visual mapping techniques

#### 4. Flexible Goal Options
- Customizable goal types while maintaining core metrics
- Adaptable to different learning styles
- Progress tracking that works with weekend-only access

#### 5. Privacy-First Design
- Individual goal tracking without teacher/parent direct access
- Secure data storage
- Student-controlled sharing preferences

## Unique Selling Proposition

### Primary Differentiator
The only goal-setting app specifically designed for boarding school students with limited phone access

### Key Advantages
- Weekend-focused design that works with institutional constraints
- Leverages limited phone access as a benefit (reduced social media distraction)
- Combines academic and Islamic education goals
- Respects student privacy while enabling progress tracking
- Designed for the boarding school ecosystem rather than adapted from general-use apps

## Technical Requirements

- **Platform**: Expo React Native (cross-platform)
- **Primary Target**: Android users (with iOS support)
- **Backend**: Supabase for data storage and management
- **Connectivity**: Designed to work with weekend Wi-Fi availability
- **Integration**: No immediate school system integration required
- **Accessibility**: Standard mobile accessibility features

### Key Technical Considerations
- Offline capability not emphasized (phones simply turned off when not allowed)
- Optimized for weekend usage patterns
- Secure data synchronization during available connection times

## Potential Challenges and Mitigation Strategies

### Challenge 1: Student Motivation and Goal Retention
**Mitigation**: Research-based motivation techniques, flexible goal-setting options, and weekend reflection to maintain engagement

### Challenge 2: Different Engagement Levels (Motivated vs. Unmotivated Students)
**Mitigation**: Adaptive interface and goal complexity based on user behavior patterns

### Challenge 3: Note-Taking and Progress Tracking Between Sessions
**Mitigation**: Comprehensive guidance on paper-based note-taking methods and structured weekend data entry

### Challenge 4: Maintaining Privacy While Enabling Progress Insights
**Mitigation**: Granular privacy controls and high-level summary data for future parent integration

## Future Development Roadmap

### Phase 1 (Current)
Core goal-setting and reflection features

### Phase 2 (Medium-term)
- AI agent integration with knowledge of academic progress
- Enhanced analytics for goal-setting behavior patterns
- Improved note-taking guidance and templates

### Phase 3 (Long-term)
- Parent portal integration with high-level summaries
- Academic performance correlation analysis
- Integration with broader MadraXis ecosystem
- Usage activity and performance metrics dashboard

## Success Metrics

- Student engagement rates during weekend sessions
- Goal completion percentages
- Academic performance improvements
- User retention and consistent usage patterns
- Student satisfaction and feedback scores

## User Stories

### For Motivated Students
- **As a motivated boarding student**, I want to set specific weekly academic goals so that I can track my progress and stay focused during the week
- **As a motivated boarding student**, I want to set Qur'an memorization targets so that I can maintain consistent spiritual growth
- **As a motivated boarding student**, I want to reflect on my weekly achievements so that I can adjust my goals and improve my study habits

### For Unmotivated Students
- **As an unmotivated boarding student**, I want simple goal-setting guidance so that I can start building better study habits
- **As an unmotivated boarding student**, I want encouragement and progress visualization that I see on weekend so that I can stay motivated throughout the week
- **As an unmotivated boarding student**, I want flexible goal options so that I can start with achievable targets

### For All Students
- **As a boarding student**, I want my goal-setting data to remain private so that I can be honest about my progress without external pressure
- **As a boarding student**, I want note-taking guidance so that I can effectively track my progress during the week when I don't have phone access
- **As a boarding student**, I want weekend reflection sessions so that I can review my week and plan for the next one

## Implementation Notes

### Design Considerations
- Clean, distraction-free interface optimized for weekend sessions
- Quick data entry for efficient weekend usage
- Clear progress visualization for motivation
- Intuitive navigation for students with varying tech comfort levels

### Data Privacy
- All student goal data encrypted and stored securely
- No direct access for teachers or parents without explicit student permission
- Future parent integration limited to high-level summaries only
- Compliance with student privacy regulations

### Integration Points
- Future AI agent integration for personalized recommendations
- Potential connection to academic performance tracking systems
- High-level reporting for parent portal (Phase 3)

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Draft for Development  
**Owner**: MadraXis Product Team