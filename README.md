# TaskMatrix — Project Management Tool

## Project Description

TaskMatrix is a commercial-grade project management web application inspired by industry tools like Jira and Asana. It is designed to help software teams plan, track, and deliver work efficiently using visual Kanban boards, structured task management, real-time analytics, and Supabase cloud database.

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
- **Database:** Supabase PostgreSQL
- **Real-time:** Supabase Realtime
- **Charts:** Recharts
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
- Kanban board with four columns: To Do, In Progress, Review, Done
- Drag and drop tasks between columns
- Create tasks — saves instantly to Supabase with UUID
- Edit tasks — pre-populated modal with full task data
- Delete tasks — confirmation dialog before permanent deletion
- Task cards showing priority badge, tags, and due date
- Tasks filtered by logged-in user — each user sees only their own data
- Optimistic UI updates — instant feedback without page reload
- Supabase Realtime sync — tasks update instantly across sessions
- Analytics dashboard with stats cards
- Pie chart showing task distribution by status
- Bar chart showing tasks by priority
- Completion rate calculation using JavaScript reduce
- Toast notifications for all actions
- Loading spinner on initial data fetch
- TypeScript strict types for all data models

---

## Live Demo

[View Live App](https://prodesk-capstone-task-matrix-xi.vercel.app)

---

## Demo Video

[Watch Week 15 Demo](https://drive.google.com/file/d/155eHYDmTZhX4N3Hj2vo0J4KHJ-OzsIes/view?usp=sharing)

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
| Week 13 | Planning and Architecture | ✅ Complete |
| Week 14 | MVP — Authentication and Routing | ✅ Complete |
| Week 15 | Full Feature Completion — CRUD + Analytics | ✅ Complete |
| Week 16 | AI Integration and Polish | ⏳ Upcoming |
| Week 17 | Final Deployment | ⏳ Upcoming |

---

## Authentication Flow

User visits app
→ Redirected to /login
→ Login with Supabase Auth
→ Session stored in Zustand with persistence
→ Redirected to /dashboard
→ Protected — no session means redirect to /login

---

## CRUD Architecture (Week 15)

Create → Add Task form → POST to Supabase → instant DOM update
Read → Fetch tasks filtered by userId → render Kanban board
Update → Edit modal pre-populated → PUT to Supabase → local state sync
Delete → Confirmation dialog → DELETE from Supabase → optimistic filter

---

## Analytics Engine (Week 15)

Tasks by Status → JavaScript reduce → Recharts Pie Chart
Tasks by Priority → JavaScript map → Recharts Bar Chart
Completion Rate → filter done tasks / total tasks x 100
Real-time updates → Supabase channel subscription by userId

---

## Getting Started

```bash
git clone https://github.com/vardhan999-hub/prodesk-capstone-TaskMatrix.git
cd prodesk-capstone-TaskMatrix
npm install
npm run dev
```

Open browser at http://localhost:3000

Add these to .env.local:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```
