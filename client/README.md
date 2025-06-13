# 🏢 WorkPlace 2.0 – Modern Team & Task Management Platform

A GitHub-style team management platform built for modern hybrid and remote workplaces. Manage organizations, teams, projects, tasks, reviews, and meetings — all in one system.

---

## 🚀 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | Next.js (App Router), Tailwind CSS, Clerk, TypeScript |
| Backend      | GraphQL Yoga, Prisma ORM       |
| Database     | PostgreSQL (hosted on Neon.tech) |
| Auth         | Clerk                          |
| State & Data | Zustand, TanStack Query        |
| Hosting      | Vercel (Frontend), Railway (Backend) |

---

## 🧩 Features

### ✅ Core System
- User roles: `Admin`, `Director`, `Member`
- Org + Team creation & user invitations
- Projects with metadata, files, labels, and categories
- Task management with:
  - Status: `Todo → Doing → Review → Done`
  - Priority: 🔥 High / 🟡 Medium / 🧊 Low
  - Labels & due dates

### 🔄 Review Workflow
- Directors can request reviews
- Members submit for approval
- Review cycles: `Requested → Changes Requested → Approved`

### 📅 Smart Calendar
- Integrated calendar view
- Task deadlines, team meetings, and room availability
- Room reservation during meeting setup

---

## 🛠️ Running the Project Locally

### 1. Clone the Repo
```bash
git clone https://github.com/Bat-World/WorkPlace-2.0.git
cd WorkPlace-2.0
