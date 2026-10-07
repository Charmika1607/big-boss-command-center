# 👑 Big Boss House Command Center

A full-stack web application designed as a digital command center for managing a reality-show house.

The **Big Boss House Command Center** allows Big Boss to monitor contestants, manage tasks, control points, handle nominations and immunity, assign the House Captain, make announcements, run task timers, monitor live statistics, and manage evictions from one centralized dashboard.

---

## 🚀 Project Overview

The application provides a centralized control system for the Big Boss House.

Big Boss can:

- 👥 Manage contestants
- 🏆 Monitor the live leaderboard
- 📋 Create and manage tasks
- ➕ Add or ➖ deduct points
- 👑 Assign the House Captain
- ⚠️ Nominate contestants
- 🛡️ Grant immunity
- 🚨 Monitor the Danger Zone
- 📢 Make Big Boss announcements
- ⏱️ Run task countdown timers
- 📊 Monitor live House statistics
- 🚪 Evict contestants

The application is designed with a modern command-center interface and supports both **Dark Mode and Light Mode**.

---

# ✨ Features

## 1. 👥 Contestant Management

Manage all contestants in the House.

Each contestant contains:

- Name
- Team
- Points
- Status
- Captain status
- Nomination status
- Immunity status

The application starts with demo contestants so that the dashboard is immediately ready for use.

---

## 2. 🏆 Live Leaderboard

The leaderboard automatically ranks active contestants based on their points.

It displays:

- Rank
- Contestant
- Team
- Points
- Status

The rankings update automatically whenever contestant points change.

Top three contestants are visually highlighted.

---

## 3. 📋 Task Management

Big Boss can create and manage House tasks.

Each task contains:

- Task name
- Description
- Assigned contestant
- Point reward
- Status

Task statuses include:

- Pending
- In Progress
- Completed

When a task is completed, the assigned contestant receives the configured points.

---

## 4. ➕ Point System

Big Boss can add or deduct points from contestants.

Every point modification can include:

- Point amount
- Reason
- Contestant

The system also maintains point activity/history.

Example:

```text
Aarav +10 — Task Completed
Kabir -5 — Rule Violation
Meera +15 — Challenge Winner
