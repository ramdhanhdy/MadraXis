## Project Status Board  
- [x] Task 1: Create branch  
- [ ] Task 2: Import raw data  
- [ ] Task 3: Configure Supabase  
- [ ] Task 4: Refactor UI  
- [ ] Task 5: Update logic  
- [ ] Task 6: RLS review  
- [ ] Task 7: Testing/docs  
- [ ] Task 8: Merge  

## Executor's Feedback or Assistance Requests  
- Task 1 completed: Branch `feat/otp-auth-hybrid` created and pushed. Draft PR opened: [PR #6](https://github.com/ramdhanhdy/MadraXis/pull/6). No issues encountered. Ready for verification.  
- Task 2 in progress: Proposed CSV template: Columns - email (required), full_name (string [[memory:941290]]), role (student/teacher/parent/management), school_id (integer, likely 1), and role-specific: For students - nis (text), date_of_birth (YYYY-MM-DD), gender (M/F), boarding (true/false); For teachers - employee_id (text), hire_date (YYYY-MM-DD), specialty (text); For parents - phone_number (text), address (text), occupation (text); For management - position (text), hire_date (YYYY-MM-DD). If students have parent links, include parent_email to create/link. Please provide CSV in this format (or note changes). Will use admin API script for import. [[memory:941311]]
(TBD for other tasks) 