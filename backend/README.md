# ZaidApp Backend

A FastAPI backend for the ZaidApp application, providing API endpoints for users, classes, students, and incident reports.

## Features

- JWT-based authentication with role-based access control
- RESTful APIs for class and student management
- Incident reporting and management
- PostgreSQL database with SQLAlchemy ORM
- Async operations for improved performance

## Requirements

- Python 3.8+
- PostgreSQL

## Setup

1. **Create a virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Set up PostgreSQL**

- Create a PostgreSQL database named `zaidapp`
- Update the `.env` file with your database credentials if needed

4. **Initialize the database**

```bash
python initialize_db.py
```

5. **Run the development server**

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` and the API documentation at `http://localhost:8000/docs`.

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login to get access token

### Classes

- `GET /api/v1/classes` - List all classes
- `POST /api/v1/classes` - Create a new class (teachers/management only)
- `GET /api/v1/classes/{class_id}` - Get class details

### Students

- `GET /api/v1/students` - List all students
- `POST /api/v1/students` - Create a new student profile (management only)
- `GET /api/v1/students/{student_id}` - Get student details

### Incidents

- `GET /api/v1/incidents` - List all incidents (with role-based filtering)
- `POST /api/v1/incidents` - Report a new incident
- `GET /api/v1/incidents/{incident_id}` - Get incident details
- `PUT /api/v1/incidents/{incident_id}` - Update incident status (teachers/management only)

## Default Users

The database initialization creates the following default users:

- **Management**: 
  - Email: admin@zaidapp.com
  - Password: admin123

- **Teacher**: 
  - Email: teacher@zaidapp.com
  - Password: teacher123

- **Student**: 
  - Email: student@zaidapp.com
  - Password: student123

- **Parent**: 
  - Email: parent@zaidapp.com
  - Password: parent123 