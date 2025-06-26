# MadraXis

A comprehensive school management application built with React Native and Expo, designed to streamline administrative tasks, student monitoring, and communication between teachers and parents.

## ✨ Key Features

- **Role-Based Access Control:** Separate interfaces and permissions for Management, Teachers, and Parents.
- **Student & Class Management:** Tools for organizing student data, class schedules, and attendance.
- **Incident Reporting:** A system for logging and tracking student-related incidents.
- **Secure Authentication:** Powered by Supabase for secure user sign-up, login, and session management.

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo (v52), Expo Router
- **Backend:** Supabase (Authentication, Database, Edge Functions)
- **Styling:** Standard React Native components
- **State Management:** React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- Expo CLI
- An account with Supabase

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ramdhanhdy/MadraXis.git
    cd MadraXis
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Supabase credentials:
    ```env
    EXPO_PUBLIC_SUPABASE_URL="your-supabase-url"
    EXPO_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```

4.  **Run the application:**
    ```bash
    npx expo start
    ```
    Follow the instructions in the terminal to open the app on an emulator, simulator, or physical device via the Expo Go app.

## 📈 Future Development

- **RLS Enhancement:** The current Row Level Security policies are functional but will be enhanced for greater security. The next phase involves transitioning from `user_metadata` to `app_metadata` for role checks and implementing `owner_id` fields for more granular data access control. See `database_rls.md` for more details.
- **Feature Expansion:** Adding modules for grading, parent-teacher communication, and more.
