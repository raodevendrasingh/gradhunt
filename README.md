# GradHunt

GradHunt is a job portal designed to help recruiters post and manage job listings for their companies. Recruiters can efficiently track and organize applications using an integrated Kanban board, streamlining the hiring process.

---

## Frontend

The frontend is a fast, interactive, and user-friendly multi-page application built with the following technologies:

- **[React](https://react.dev/)**  
- **[Tailwind CSS](https://tailwindcss.com/)**  
- **[Tanstack Router](https://tanstack.com/router/latest)**  
- **[Clerk Auth](https://clerk.com/)**  
- **[Zustand](https://zustand-demo.pmnd.rs/)**  

---

## Backend

The backend is a robust and scalable system that delivers data via its RESTful API (with a browsable API interface). It is developed in Python and built with the following technologies:

- **[Django](https://www.djangoproject.com/)**  
- **[Django Rest Framework](http://www.django-rest-framework.org/)**  
- **[Neon PostgreSQL](https://neon.tech/)**  

---

## API Endpoints

The following API endpoints are available (browseable at `/api`):

```
api/company
api/company/{companyslug}
api/company/{companyslug}/jobs
api/company/{companyslug}/applicants/{jobId}
api/jobs/recent
api/jobs/list
api/jobs/query
api/jobs/filters
api/jobs/save/{jobId}
api/jobs/saved
api/jobs/apply/{jobId}
api/jobs/applied
api/jobs/post
api/jobs/update/{jobId}
api/jobs/manage/{jobId}
api/job/{jobId}
api/application/{applicationId}
api/users/check-company-slug/
api/users/type
api/users/check-username/
api/users/username
api/users/check-email/
api/users/email
api/users/send-verification-email
api/users/verify-email
api/users
api/users/onboarding/
api/users/visibility
api/users/notification/
api/users/profile-image
api/users/description
api/users/skills
api/users/resume
api/users/projects
api/users/certificates
api/users/experiences
api/users/education
api/users/{username}
api/users/{username}/completion-percentage
api/users/{username}/linguistics
api/users/{username}/socials
api/users/{username}/description
api/users/{username}/experiences
api/users/{username}/education
api/users/{username}/projects
api/users/{username}/certificates
api/users/{username}/skills
api/users/{username}/experiences/{id}
api/users/{username}/education/{id}
api/users/{username}/projects/{id}
api/users/{username}/certificates/{id}
api/users/experiences/{id}
api/users/education/{id}
api/users/projects/{id}
api/users/certificates/{id}
```

## Installation

Make sure you have following software installed in your system:
* Python 3
* NodeJS
* npm / pnpm
* Git
* uv

First, we need to clone the repository
```
https://github.com/raodevendrasingh/gradhunt.git
```
```
cd gradhunt
```


Install all required dependencies in an isolated environment

### Frontend
```
cd frontend
pnpm install
```
Copy the `.env.sample` as `.env` in `frontend` folder
```
cp .env.sample .env
```

### Backend
```
cd backend
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

Copy the `.env.sample` as `.env` in `backend` folder
```
cp .env.sample .env
```


## Running the local server

### Frontend
```
cd frontend
pnpm dev
```
Frontend should be available on http://localhost:5173/

### Backend
```
cd backend
source .venv/bin/activate
python manage.py runserver
```
The API endpoints will be available on http://localhost:8000/api

Run `deactivate` to deactivate the server.
