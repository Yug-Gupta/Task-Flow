# TaskFlow (To-do app)

A full-stack task management application with user authentication, calendar view, and dashboard analytics. Built with modern web technologies for seamless productivity and task organization.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Setup](#environment-setup)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Frontend
- **User Authentication**: Secure login and signup system
- **Dashboard**: Overview of tasks and quick statistics
- **Calendar View**: Visual representation of tasks on a calendar
- **Settings**: User profile and preference management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **State Management**: Efficient task and auth state management with Zustand

### Backend
- **RESTful API**: Clean and efficient API endpoints
- **Authentication**: JWT-based user authentication
- **Task Management**: Create, read, update, and delete tasks
- **User Management**: User registration and profile management
- **Database**: MongoDB for persistent data storage

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Lightning-fast build tool
- **JavaScript/JSX** - Programming language
- **CSS** - Styling
- **Zustand** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication token management
- **Middleware** - Custom authentication middleware

---

## 📁 Project Structure

```
To-Do app/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   └── layout/
│   │   │       └── Layout.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Settings.jsx
│   │   ├── store/               # State management
│   │   │   ├── useAuthStore.js
│   │   │   └── useTaskStore.js
│   │   ├── utils/               # Utility functions
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js backend application
│   ├── models/                  # Database models
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   └── tasks.js             # Task routes
│   ├── middleware/              # Custom middleware
│   │   └── auth.js              # Auth verification
│   ├── data_store/              # MongoDB data directory
│   ├── index.js                 # Server entry point
│   ├── db.js                    # Database configuration
│   ├── store.js                 # Store initialization
│   ├── data.json                # Sample data
│   └── package.json
│
├── package.json
└── readme.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

### Clone the Repository

```bash
git clone https://github.com/Yug-Gupta/To-Do-app.git
cd To-Do-app
```

### Setup Backend

```bash
cd backend
npm install
npm start
```

The backend server will start on `http://localhost:5000` (or your configured port)

### Setup Frontend

In a new terminal, from the root directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 📖 Usage

### Getting Started

1. **Open the application** in your browser at `http://localhost:5173`
2. **Create an account** or login if you already have one
3. **Add tasks** using the dashboard
4. **Organize tasks** by viewing them in calendar format
5. **Manage settings** for your profile and preferences

### Main Features

- **Dashboard**: View all your tasks and get a quick overview
- **Calendar View**: See tasks organized by date on an interactive calendar
- **Add/Edit/Delete Tasks**: Full CRUD operations for task management
- **User Settings**: Customize your account and application preferences

---

## 🔌 API Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/register` | Register a new user | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/` | Get all tasks | Yes |
| GET | `/:id` | Get specific task | Yes |
| POST | `/` | Create new task | Yes |
| PUT | `/:id` | Update task | Yes |
| DELETE | `/:id` | Delete task | Yes |

---

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Standards
- Write clean, readable code
- Add comments for complex logic
- Test your changes before submitting a PR
- Follow existing code style

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact & Support

For questions, suggestions, or issues:
- **GitHub Issues**: [Open an issue](https://github.com/Yug-Gupta/To-Do-app/issues)
- **GitHub Profile**: [@Yug-Gupta](https://github.com/Yug-Gupta)

---

## 🎯 Future Enhancements

- [ ] Add task categories and tags
- [ ] Implement task priorities
- [ ] Add recurring tasks
- [ ] Email notifications
- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Collaborative task sharing
- [ ] Task analytics and reports

---

**Made with ❤️ by Yug Gupta**
