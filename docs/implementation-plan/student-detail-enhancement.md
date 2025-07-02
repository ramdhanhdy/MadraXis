# Student Detail Screen Enhancement

**Created:** 2025-07-03

## Branch Name
`feat/student-detail-enhancement`

## Background and Motivation
During a recent review, it was noted that the teacher-facing Student Detail screen (`app/screens/teacher/StudentDetail.tsx`) displays "Tidak diketahui" (Unknown) for several important fields. This is because the underlying data fetching logic does not retrieve all the necessary information, such as the student's class, parent details, and address.

This task aims to fix this by enhancing the data service layer to fetch a complete student profile, ensuring the UI can display comprehensive and useful information to teachers.

## Key Challenges and Analysis
- **Complex Data Aggregation**: The required information is spread across multiple tables (`profiles`, `student_details`, `class_students`, `classes`, `student_parent`, `parent_details`). The primary challenge is to construct an efficient Supabase query that joins these tables and retrieves all necessary fields in a single call.
- **Data Model Confirmation**: We need to confirm the exact relationships and column names, especially for parent-student links and addresses. Based on initial analysis, `address` and `phone` are likely stored in `parent_details`, not `student_details`.
- **UI Graceful Fallbacks**: The UI must handle cases where related data does not exist (e.g., a student not yet assigned to a class or parent).

## High-level Task Breakdown
1. **Create Feature Branch**: Create and switch to a new branch named `feat/student-detail-enhancement` from the `master` branch.
2. **Update Data Types**: Modify the `Student` interface in `src/types/index.ts` to include the new fields: `class_name?: string`, `parent_name?: string`, `parent_phone?: string`, and `address?: string`. Making them optional will help handle cases where data is not available.
3. **Enhance `fetchStudentById` Service**:
    - Modify the `fetchStudentById` function in `src/services/users.ts`.
    - The Supabase query must be updated to:
        - Join `class_students` and then `classes` to retrieve `classes.name` as `class_name`.
        - Join `student_parent`, then `profiles` (for the parent), and `parent_details` to retrieve the parent's `full_name`, `phone_number`, and `address`.
    - The function should map the retrieved data to the updated `Student` type.
4. **Update Student Detail UI**:
    - In `app/screens/teacher/StudentDetail.tsx`, update the `fetchStudentData` function.
    - Remove the `TODO` comments and empty string assignments.
    - Map the new fields from the fetched student object to the component's state, using a fallback like "-" or "Not Assigned" if a field is null or undefined.
5. **Manual Testing**:
    - Verify that the Student Detail screen correctly displays the `class`, `parent_name`, `phone`, and `address`.
    - Test with a user who is missing some of this associated data to ensure the UI handles it gracefully without crashing.
6. **PR, Review, and Merge**: Once testing is complete, open a pull request for review and merge it into `master`.

## Project Status Board
- [x] (1) Create feature branch
- [x] (2) Update Data Types
- [x] (3) Enhance `fetchStudentById` Service
- [x] (4) Update Student Detail UI
- [x] (5) Manual Testing
- [ ] (6) PR, Review, and Merge

## Executor's Feedback or Assistance Requests
All implementation tasks are complete. The `fetchStudentById` service now correctly retrieves related class, parent, and address information, and the `StudentDetail` UI has been updated to display this data. Manual testing has confirmed that the changes work as expected for students with and without complete data.

The branch is ready for a Pull Request, review, and merge.

## Lessons Learned
*(To be filled in during execution)* 