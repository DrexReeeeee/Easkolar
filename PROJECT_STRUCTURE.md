# Easkolar Project Structure

This document outlines the folder and file structure of the Easkolar project, a scholarship platform with backend and frontend components.

EaseKolar/
├── .gitignore                       # Git ignore rules
├── easekolar_db.sql                 # Database schema file
├── PROJECT_STRUCTURE.md             # Project structure documentation
├── TODO.md                          # Task list
├── backend/                         # Backend (Node.js/Express)
│   ├── package.json                 # Backend dependencies and scripts
│   ├── package-lock.json            # Lockfile for dependencies
│   ├── server.js                    # Main server entry point
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js        # Authentication logic
│   │   ├── bookmarkController.js    # Bookmark management
│   │   ├── chatBotController.js     # Chatbot functionality
│   │   └── scholarshipController.js # Scholarship operations
│   ├── middleware/
│   │   └── authMiddleware.js        # Authentication middleware
│   ├── models/                      # Sequelize models
│   │   ├── Bookmark.js              # Bookmark model
│   │   ├── Scholarship.js           # Scholarship model
│   │   └── User.js                  # User model
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── bookmarkRoutes.js        # Bookmark routes
│   │   ├── chatBotRoutes.js         # Chatbot routes
│   │   └── scholarshipRoutes.js     # Scholarship routes
│   └── utils/
│       └── aiHelper.js              # AI utility functions
└── frontend/                        # Frontend (React)
    ├── package.json                 # Frontend dependencies and scripts
    ├── package-lock.json            # Lockfile for dependencies
    ├── README.md                    # Frontend README
    ├── public/                      # Static assets
    │   ├── index.html               # Main HTML template
    │   ├── manifest.json            # PWA manifest
    │   ├── robots.txt               # Robots file
    │   └── assets/                  # Additional assets
    │       ├── favicon.ico          # Favicon
    │       ├── logo-trans.png       # Transparent logo image
    │       ├── LOGO.png             # Logo image
    │       ├── signin-img.png       # Sign-in page image
    │       └── signup-img.png       # Sign-up page image
    └── src/                         # Source code
        ├── App.css                  # Main app styles
        ├── App.js                   # Main app component
        ├── App.test.js              # App tests
        ├── components/              # Reusable components
        │   └── navbar.js            # Navigation bar component
        ├── index.css                # Global styles
        ├── index.js                 # App entry point
        ├── logo.svg                 # React logo
        ├── reportWebVitals.js       # Performance monitoring
        ├── setupTests.js            # Test setup
        ├── styles/                  # Stylesheets
        │   ├── home.css             # Home page styles
        │   ├── main.css             # Main styles
        │   ├── navbar.css           # Navbar styles
        │   ├── root.css             # Root styles
        │   ├── signin.css           # Sign-in page styles
        │   └── signup.css           # Sign-up page styles
        └── pages/                   # Page components
            ├── admin/               # Admin pages
            │   └── dashboard.js     # Admin dashboard
            ├── auth/                # Authentication pages
            │   ├── SignIn.js        # Sign-in page
            │   └── SignUp.js        # Sign-up page
            ├── home.js              # Home page
            └── user/                # User pages
                ├── components/      # User-specific components
                │   ├── header.js    # User header component
                │   └── sidebar.js   # User sidebar component
                ├── dashboard.js     # User dashboard
                ├── bookmarks.js     # User bookmarks page
                ├── scholarships.js  # User scholarships page
                ├── Chatbot.js       # User chatbot page
                ├── UserLayout.js    # User layout component
                └── styles/          # User-specific styles
                    ├── dashboard.css    # Dashboard styles
                    ├── bookmarks.css    # Bookmarks styles
                    ├── chatbot.css      # Chatbot styles
                    ├── header.css       # Header styles
                    ├── scholarships.css # Scholarships styles
                    └── sidebar.css      # Sidebar styles

## Description

- **Backend**: Built with Node.js, Express, and Sequelize for database management. Handles authentication, scholarship data, bookmarks, and an AI-powered chatbot.
- **Frontend**: React application with Bootstrap for styling. Uses Axios for API calls and React Router for navigation.
- **Database**: MySQL database with schema defined in `easekolar_db.sql`.

This structure follows best practices for a full-stack MERN-like application (though using MySQL instead of MongoDB).
