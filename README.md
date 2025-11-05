# FlowData - Student Management System

A modern, responsive student management system built with React, Vite, TailwindCSS, and DaisyUI. This application provides a complete solution for managing student records with user authentication, role-based access control, and a beautiful dark/light theme.

## 🚀 Features

### Authentication & Authorization
- **User & Admin Login**: Separate authentication endpoints for regular users and administrators
- **User & Admin Signup**: Register as either a user or admin with role-based access
- **JWT Token Authentication**: Secure token-based authentication stored in localStorage
- **Dynamic Theme Switching**: Automatically switches to dark mode for admin login/signup
- **Protected Routes**: Dashboard access requires valid authentication token

### Student Management (Dashboard)
- **View All Students**: Paginated table view of all student records
- **Add New Students**: Create new student records with validation
- **Edit Students**: Update existing student information
- **Delete Students**: Remove student records from the database
- **Search Functionality**: Search students by name and grade
- **Sorting**: Sort students by ID, name, roll number, age, or grade (ascending/descending)
- **Pagination**: Navigate through student records with customizable page size (default: 10 records/page)
- **Real-time Updates**: Instant refresh after any CRUD operation

### UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Modern UI Components**: Built with DaisyUI for a polished look
- **Form Validation**: Client-side validation for all input fields
- **Error Handling**: User-friendly error messages for failed operations
- **Loading States**: Visual feedback during API calls
- **Modal Dialogs**: Clean modal interface for add/edit operations

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4 + DaisyUI
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: SVG icons for UI elements

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Backend API** running (default: `http://localhost:8000`)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/27SHIVAMSUYAL/flowdata-frontend-react.git
   cd flowdata-frontend-react/flowdata
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```properties
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Local: `http://localhost:5173`
   - Network: `http://YOUR_IP:5173` (for mobile access on same WiFi)

## 📱 Mobile Access

The application is configured to be accessible from mobile devices on the same network:

1. Find your computer's IP address:
   ```bash
   hostname -I | awk '{print $1}'
   ```

2. Access from mobile browser: `http://YOUR_IP:5173`

3. If connection fails, allow port 5173 through firewall:
   ```bash
   sudo ufw allow 5173
   ```

## 📂 Project Structure

```
flowdata/
├── public/
│   ├── image.png          # User avatar image
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Hero.jsx       # Main dashboard table component
│   │   └── Navbar.jsx     # Navigation bar with theme toggle
│   ├── pages/
│   │   ├── Dashboard.jsx  # Main dashboard page
│   │   ├── Login.jsx      # Login page with user/admin toggle
│   │   └── Signup.jsx     # Signup page with user/admin toggle
│   ├── App.jsx            # Main app with routing
│   ├── App.css            # Custom styles (text-glow effect)
│   ├── index.css          # Global styles & TailwindCSS imports
│   └── main.jsx           # App entry point
├── .env                   # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js     # TailwindCSS & DaisyUI config
├── vite.config.js         # Vite configuration
└── README.md
```

## 🔑 API Endpoints

The application expects the following backend API endpoints:

### Authentication
- `POST /user-login` - User login
- `POST /admin-login` - Admin login
- `POST /user-signup` - User registration
- `POST /admin-signup` - Admin registration

### Student Management
- `GET /get-all-students` - Fetch paginated students with sorting/searching
  - Query params: `page`, `limit`, `sort_by`, `sort_order`, `name`, `grade`
- `POST /add-student` - Create new student
- `PUT /update-student/{id}` - Update student by ID
- `DELETE /delete-student/{id}` - Delete student by ID

All protected endpoints require:
```javascript
headers: {
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

## 🎨 Theme Configuration

The application uses DaisyUI themes with custom configuration:

- **Light Theme**: Default for regular users
- **Dark Theme**: Auto-enabled for admin login/signup, togglable in dashboard

Custom CSS effects:
- `.text-glow`: Red glow effect for admin labels

## 🔒 Security Features

- **JWT Token Storage**: Access tokens stored in localStorage
- **User Type Tracking**: User role stored for role-based UI changes
- **Input Validation**: Required fields validation
- **Error Handling**: Clear input fields on failed login
- **Protected Routes**: Dashboard requires authentication

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📦 Dependencies

### Main Dependencies
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^7.1.1
- `axios`: ^1.7.9

### Dev Dependencies
- `vite`: ^6.0.5
- `@vitejs/plugin-react`: ^4.3.4
- `tailwindcss`: ^4.0.0
- `@tailwindcss/vite`: ^4.0.0-beta.7
- `daisyui`: ^4.12.22
- `eslint`: ^9.17.0

## 🐛 Troubleshooting

### Environment Variables Not Loading
- Restart the dev server after changing `.env`
- Use `VITE_` prefix for all environment variables

### CORS Issues
- Ensure backend allows CORS from frontend origin
- Check backend CORS configuration for `http://YOUR_IP:5173`

### Firewall Blocking Mobile Access
```bash
sudo ufw allow 5173
# or
sudo firewall-cmd --add-port=5173/tcp --permanent
sudo firewall-cmd --reload
```

### Dark Mode Not Working
- Verify `data-theme` attribute on `<html>` element
- Check DaisyUI themes in `tailwind.config.js`

## 👥 User Roles

### Regular User
- Can view, add, edit, and delete student records
- Light theme by default
- Access via `/user-login` and `/user-signup`

### Admin
- Same permissions as regular user
- Dark theme enabled during login/signup
- Access via `/admin-login` and `/admin-signup`
- Visual indicators (glowing text) on auth pages

## 🎯 Future Enhancements

- [ ] Export student data to CSV/Excel
- [ ] Bulk student import
- [ ] Student profile pictures
- [ ] Advanced filtering options
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Activity logs/audit trail
- [ ] Student performance analytics

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Shivam Suyal**
- GitHub: [@27SHIVAMSUYAL](https://github.com/27SHIVAMSUYAL)
- Repository: [flowdata-frontend-react](https://github.com/27SHIVAMSUYAL/flowdata-frontend-react)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- UI components from [DaisyUI](https://daisyui.com/)
- Icons from [Heroicons](https://heroicons.com/)
