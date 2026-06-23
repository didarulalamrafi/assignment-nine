#  MediQueue — Tutor Booking System

**MediQueue** is a full-stack tutor booking web application that allows students to register, log in, browse available tutors, and book online learning sessions based on subject and time availability. The system generates digital session tokens for each booking and helps users manage their scheduled classes efficiently.

 **Live Site:** [MediQueue](https://mediqueue-orcin.vercel.app/)

---

##  Features

-  **Authentication System** — Email/password registration + Google OAuth login with JWT authentication for secure private routes
-  **Browse & Book Tutors** — View all available tutors in a responsive grid layout, filter by subject, and book sessions based on real-time slot availability
-  **Smart Booking Logic** — Auto-checks total slot availability and session start date; prevents booking if slots are full or session hasn't started yet
-  **Manage Tutors** — Logged-in users can add new tutors, edit existing ones, and delete their own tutor listings (CRUD operations)
-  **My Booked Sessions** — View all booked sessions in a table format and cancel bookings with a confirmation modal (status updates to "cancelled")
-  **Dark/Light Theme** — Theme toggling implemented across the entire application with cookie-based persistence
-  **Search & Filter** — Search tutors by name (case-insensitive) and filter by registration date range (start & end date)

---

##  Tech Stack

| Layer       | Technologies                                                                 |
|-------------|------------------------------------------------------------------------------|
| Frontend    | Next.js 15 (App Router), Tailwind CSS, HeroUI                               |
| Backend     | Node.js, Express.js                                                          |
| Database    | MongoDB Atlas                                                                |
| Auth        | BetterAuth (Email/Password + Google OAuth) + JWT                            |

---

##  Pages & Access Levels

| Page               | Route             | Access          |
|--------------------|-------------------|------------------|
| Home               | `/`               | Public           |
| Tutors             | `/tutors`         | Public           |
| Tutor Details      | `/tutors/[id]`    | Private          |
| Add Tutor          | `/add-tutor`      | Private          |
| My Tutors          | `/my-tutors`      | Private          |
| My Booked Sessions | `/my-bookings`    | Private          |
| Login              | `/login`          | Public           |
| Register           | `/register`       | Public           |

---

##  Key Rules Followed

-  Minimum **15 client-side** and **8 server-side** GitHub commits
-  **No Lorem ipsum** text used anywhere
-  No default browser alerts — all errors/successes shown via toast notifications
-  Fully responsive (mobile, tablet, desktop)
-  Dynamic document title based on route
-  Custom 404 page and error handling
-  Loading spinner on all data fetching states
-  JWT implemented on all private routes

---

## 🌐 Live Links

- 🌍 **Frontend (Client):** [MediQueue](https://mediqueue-orcin.vercel.app/)
- 🖥️ **Backend (Server):** [Mediqueue-server](https://medi-queue-server-two.vercel.app/)

---

## 📦 GitHub Repositories

- 📘 **Client Side:** [https://github.com/Sourov-Chandra/a-9_Mediqueue-client-side](https://github.com/Sourov-Chandra/a-9_Mediqueue-client-side)
- 📗 **Server Side:** [https://github.com/Sourov-Chandra/a-9_mediqueue-server](https://github.com/Sourov-Chandra/a-9_mediqueue-server)

---
