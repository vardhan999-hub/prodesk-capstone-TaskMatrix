# TaskMatrix — Project Management Tool

## Project Description

TaskMatrix is a commercial-grade project management web application inspired by industry tools like Jira and Asana. It is designed to help software teams plan, track, and deliver work efficiently using visual Kanban boards, structured task management, team collaboration features, and a real-time activity feed.

---

## Track

Frontend Intern

---

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Inline Styles + Tailwind CSS
- **Component Library:** Shadcn UI
- **State Management:** Zustand with persist middleware
- **Authentication:** Supabase Auth
- **Mock API:** JSON Server
- **Deployment:** Vercel

---

## Core Features

- User registration with email and password
- User login with Supabase Authentication
- Real-time password strength indicator on register
- Field-level form validation on login and register
- Protected routes — unauthorized users redirected to login
- Global state management using Zustand with persistence
- User name and email stored globally after login
- Project dashboard showing active projects
- Kanban board with four columns: To Do, In Progress, Review, Done
- Drag and drop tasks between columns
- Create, edit, and delete tasks
- Task cards showing priority badge, assignee, and due date
- Task detail page with full task information
- Activity feed showing recent project actions
- Filter tasks by priority, assignee, and tag

---

## Live Demo

[View Live App](https://prodesk-capstone-task-matrix-xi.vercel.app)

---

## Figma Design

[View TaskMatrix Figma Design](https://www.figma.com/design/qFNHYq04MLfDN9EeTMDNfx/TaskMatrix-Capstone?node-id=0-1&t=WryPBVim6PfYXV6O-1)

---

## Architecture Diagram

![State Tree Diagram](https://raw.githubusercontent.com/vardhan999-hub/prodesk-capstone-TaskMatrix/main/architecture-diagram.png)

---

## Week by Week Progress

| Week | Goal | Status |
|------|------|--------|
| Week 13 | Planning and Architecture | Complete |
| Week 14 | MVP — Authentication and Routing | Complete |
| Week 15 | Full Feature Completion | In Progress |
| Week 16 | AI Integration and Polish | Upcoming |
| Week 17 | Final Deployment | Upcoming |

---

## Authentication Flow

User visits app
→ Redirected to /login
→ Login with Supabase Auth
→ Session stored in Zustand with persistence
→ Redirected to /dashboard
→ Protected — no session means redirect to /login

---

## Getting Started

```bash
git clone https://github.com/vardhan999-hub/prodesk-capstone-TaskMatrix.git
cd prodesk-capstone-TaskMatrix
npm install
json-server --watch data/db.json --port 3001
npm run dev
```

Open browser at http://localhost:3000

Add these to .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
