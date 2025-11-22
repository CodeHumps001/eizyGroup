# eizyGroup — Bias-Free Group Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue)](https://www.javascript.com/)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/CodeHumps001/eizyGroup)

## 🎯 About eizyGroup

**eizyGroup** is a smart, bias-free group generation application designed for educators, facilitators, and team leaders. It creates fair, balanced groups instantly with zero bias, helping you save time on administrative tasks while ensuring fairness in team assignments.

### Why eizyGroup?

- **🎯 Completely Bias-Free**: Algorithms eliminate human bias from group assignments
- **⚡ Lightning Fast**: Generate groups in seconds with no setup required
- **🔒 100% Private**: All data stays on your device—no servers, no tracking, no data collection
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **🎓 Flexible**: Perfect for classrooms, workshops, team building, conferences, and research
- **💡 Intuitive**: Paste names, click generate, export results—that's it!

---

## 🚀 Features

### Core Features

- **Smart Group Generation**: Randomly shuffle and distribute names into balanced groups
- **Flexible Configuration**: Generate by number of groups OR students per group
- **CSV Import/Export**: Import student lists from CSV and export results
- **Generation History**: Track all past group generations with timestamps
- **Dark Mode**: Eye-friendly dark theme for comfortable use

### User Management

- **User Authentication**: Secure signup and login system with email validation
- **User Accounts**: Create an account and save your group generation history
- **Session Management**: Persistent login with localStorage-based session storage
- **Account Settings**: Manage profile information and user preferences

### Advanced Features

- **History Management**: View, reload, or delete past group generations
- **Auto-Save**: Automatically save generations to history (configurable)
- **Export Options**: Download groups as CSV for use in Excel, Google Sheets, or other tools
- **Responsive UI**: Optimized for all screen sizes (mobile-first design)
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

---

## 📁 Project Structure

```
eizyGroup/
├── index.html           # Landing page with hero, features, testimonials, and CTA
├── dashboard.html       # Main dashboard with generator, history, and settings
├── css/
│   └── styles.css       # Comprehensive styling (2100+ lines)
├── js/
│   ├── app.js          # Main application logic (authentication, UI, generation)
│   ├── models/         # [To be implemented] Data models for MVP
│   ├── views/          # [To be implemented] UI rendering components
│   └── presenters/     # [To be implemented] Business logic presenters
└── README.md           # This file
```

---

## 🛠 Technology Stack

### Frontend

- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Modern features (grid, flexbox, backdrop filters, CSS variables)
- **JavaScript (ES6+)**: Core application logic
- **LocalStorage API**: Client-side data persistence

### Architecture (Current)

- **Monolithic JavaScript**: Single `app.js` file with modular functions
- **MVC-Inspired**: Separation of concerns through functional patterns

### Architecture (Planned)

- **OOP (Object-Oriented Programming)**: Classes for better organization
- **MVP (Model-View-Presenter)**: Strict separation of data, UI, and business logic

---

## 📦 Installation & Setup

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/CodeHumps001/eizyGroup.git
   cd eizyGroup
   ```

2. **Start a local server** (PowerShell)

   ```powershell
   cd "C:\Users\code\Desktop\eizyGroup"
   python -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Alternative Servers

- **Node.js**: `npx http-server`
- **PHP**: `php -S localhost:8000`
- **Direct File**: Open `index.html` in your browser (limited functionality due to CORS)

---

## 📖 Usage Guide

### For First-Time Users

1. **Visit the Landing Page** (`index.html`)

   - Read about eizyGroup features
   - View testimonials and use cases
   - Click "Get Started" to create an account

2. **Create an Account**

   - Enter your name, email, and password
   - Passwords must be at least 6 characters
   - Account data is saved locally on your device

3. **Access the Dashboard** (`dashboard.html`)
   - Requires login to access
   - Three main tabs: Generator, History, Settings

### Using the Generator

1. **Input Student Names**

   - Paste names directly in the textarea (one per line)
   - OR click "Import CSV" to upload a CSV file
   - Supported CSV format: one name per line or in first column

2. **Configure Groups**

   - **Option A**: Set "Number of Groups" (e.g., 4 groups)
   - **Option B**: Set "Students per Group" (e.g., 5 students per group)
   - Leave both blank for auto-distribution (~3 students per group)

3. **Generate & Export**
   - Click "Generate Groups" button
   - Results appear instantly as organized cards
   - Click "Export as CSV" to download results

### Managing History

- **View History**: Click the "History" tab
- **Reload Generation**: Click "Load" on any history entry to re-display groups
- **Delete Entry**: Click "Delete" to remove from history
- **Clear All**: Use Settings tab to clear entire history

### Settings & Preferences

- **Dark Mode**: Toggle for comfortable viewing
- **Auto-Save**: Enable/disable automatic history saving
- **User Info**: View your profile details
- **Data Management**: Clear generation history

---

## 🔐 Security & Privacy

### Data Privacy

- ✅ **No server uploads**: All data remains on your device
- ✅ **No analytics tracking**: We don't track your usage
- ✅ **No third-party sharing**: Your data is never sold or shared
- ✅ **Browser-only storage**: Uses localStorage for persistence

### Authentication Security

- ⚠️ **Note**: Passwords are currently stored in plain text in localStorage for demo purposes
- 🔒 **Production**: Should use proper backend hashing (bcrypt, Argon2, etc.)

### WCAG Accessibility Compliance

- ✓ Color contrast ratios meet WCAG 2.1 AA standards
- ✓ Keyboard navigation fully supported
- ✓ Screen reader friendly with ARIA labels
- ✓ Skip-to-content link for keyboard users
- ✓ Focus indicators on interactive elements

---

## 📊 Use Cases

### 🎓 Education

- Create balanced project teams for classrooms
- Form discussion groups for seminars
- Assign group assignments fairly

### 👥 Team Building

- Organize breakout groups for workshops
- Create balanced teams for activities
- Run fair ice-breaker exercises

### 🎯 Events & Conferences

- Split participants into discussion groups
- Form networking groups by interest
- Organize breakout sessions

### 📈 Research & Testing

- Create control and experimental groups
- Ensure fair participant assignment
- Support academic studies

---

## 🎨 UI/UX Highlights

### Landing Page (index.html)

- Full-viewport hero section with animated SVG
- 8 comprehensive feature sections
- Testimonial cards with social proof
- Security & privacy information
- Use cases section
- Final CTA
- Responsive design for all devices

### Dashboard (dashboard.html)

- **Generator Tab**: Student input, configuration, results display
- **History Tab**: Generation log with timestamps
- **Settings Tab**: User preferences and data management
- **Sidebar Navigation**: Easy tab switching
- **Dark Mode Toggle**: Theme customization
- **Logout Button**: Session management

### Design System

- **Colors**: Modern indigo/blue palette (#1e6fb3, #35449e)
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle depth with layered shadows
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Breakpoints**: Mobile (480px), Tablet (768px), Desktop (1024px+)

---

## 🔄 Current Architecture (Monolithic)

The current implementation uses a functional approach with modular functions:

```javascript
// Authentication functions
-signup(name, email, password, confirmPassword) -
  login(email, password) -
  logout() -
  isLoggedIn() -
  // Group generation
  generateGroups(inputs) -
  computeGroups(names, numGroups, perGroup) -
  renderGroups(groups) -
  // UI Management
  showLoginModal() -
  hideLoginModal() -
  switchTab(tabName) -
  updateThemeToggle() -
  // Storage Management
  saveUsers() -
  saveCurrentUser() -
  saveGroupHistory();
```

---

## 🏗️ Planned MVP Architecture

### Models (Data Layer)

```javascript
class User {
  constructor(email, name, password, joinDate)
  toJSON()
  static fromJSON(data)
}

class GroupGeneration {
  constructor(names, groups, config)
  id
  timestamp
  numStudents
  numGroups
}

class AppState {
  currentUser
  groupHistory[]
  currentGroups
  theme
  preferences
}
```

### Presenters (Business Logic)

```javascript
class AuthPresenter {
  signup(name, email, password, confirmPassword)
  login(email, password)
  logout()
  validateEmail(email)
  validatePassword(password)
}

class GeneratorPresenter {
  generateGroups(names, numGroups, perGroup)
  randomizeArray(array)
  distributeIntoGroups(names, k)
  exportAsCSV(groups)
}

class HistoryPresenter {
  getHistory()
  addGeneration(generation)
  deleteGeneration(id)
  loadGeneration(id)
  clearAll()
}
```

### Views (UI Layer)

```javascript
class AuthView {
  showLoginForm()
  showSignupForm()
  displayError(message)
  displaySuccess(message)
  clearForm()
}

class GeneratorView {
  renderGroups(groups)
  displayResults(results)
  updateGroupCount(count)
  showLoadingState()
}

class HistoryView {
  renderHistory(entries)
  renderHistoryItem(entry)
  showEmptyState()
}

class SettingsView {
  renderUserInfo(user)
  renderPreferences(prefs)
  showMessage(type, message)
}
```

---

## 🚀 Getting Started with Development

### File Modifications (Current)

1. All application logic is in `js/app.js` (~900 lines)
2. Styles in `css/styles.css` (~2100 lines)
3. HTML structure in `index.html` and `dashboard.html`

### Next Steps (Planned)

1. Create `js/models/` directory for data models
2. Create `js/views/` directory for UI components
3. Create `js/presenters/` directory for business logic
4. Refactor `app.js` into MVP pattern
5. Create `js/app-init.js` to bootstrap the application

---

## 📝 Key Functions Explained

### Group Generation Algorithm

```javascript
function computeGroups(names, numGroups, perGroup) {
  // 1. Shuffle array using Fisher-Yates algorithm
  // 2. Determine group count (by groups or by students per group)
  // 3. Distribute names evenly across groups
  // 4. Return array of groups
}
```

### Storage Management

- **Users**: Stored as `eizyGroup_users` in localStorage
- **Current User**: Stored as `eizyGroup_currentUser`
- **History**: Stored as `eizyGroup_history` (max 50 entries)
- **Theme**: Stored as `eizyGroup_theme`
- **Preferences**: Stored as individual keys

### Authentication Flow

```
User Input → Validation → Check Duplicate/Credentials
→ Save to Storage → Update UI → Redirect
```

---

## 🐛 Known Issues & Limitations

### Current Limitations

- ⚠️ No backend server—data persists only in browser localStorage
- ⚠️ Passwords stored in plain text (security risk in production)
- ⚠️ No password recovery mechanism
- ⚠️ Limited to ~50 MB localStorage quota
- ⚠️ Data lost if browser storage is cleared

### Browser Compatibility

- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+
- ⚠️ IE 11 not supported (no ES6 support)

---

## 🎯 Future Roadmap

### Phase 2: Backend Integration

- [ ] Implement Node.js/Express backend
- [ ] Add MongoDB database for persistent storage
- [ ] Implement proper password hashing (bcrypt)
- [ ] Add email verification
- [ ] Create REST API endpoints

### Phase 3: Advanced Features

- [ ] Team/classroom management
- [ ] Shared group settings
- [ ] Analytics dashboard
- [ ] API integration (Google Classroom, Canvas)
- [ ] Advanced group algorithms (skill-based, preference-based)

### Phase 4: Enterprise

- [ ] Multi-tenant support
- [ ] SSO integration
- [ ] Audit logging
- [ ] Advanced permissions
- [ ] Dedicated support

---

## 📄 File Descriptions

### index.html (Landing Page)

- Hero section with CTA
- Feature showcase (4 cards)
- Benefits grid (6 items)
- Testimonials (3 cards)
- Security & privacy section
- Use cases section
- Final CTA
- Login/Signup modals

### dashboard.html (Main App)

- Header with user info and theme toggle
- Sidebar with navigation tabs
- Generator tab (input + results)
- History tab (generation log)
- Settings tab (preferences)
- Login/Signup modals

### css/styles.css

- CSS variables for theming
- Dark mode support
- Responsive design (mobile-first)
- Component styles
- Utility classes
- Animation keyframes
- WCAG accessibility features

### js/app.js

- Authentication system (signup, login, logout)
- Group generation algorithm
- UI event handlers
- Storage management
- History tracking
- Theme management
- CSV import/export
- Modal controls

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, feature requests, or questions:

- **GitHub Issues**: [Open an issue](https://github.com/CodeHumps001/eizyGroup/issues)
- **Email**: Support via repository contact
- **Documentation**: Check this README and inline code comments

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Modern web applications and design systems
- **Icons**: Emoji and Unicode for visual elements
- **Fonts**: Inter from Google Fonts
- **Community**: Thanks to all users and contributors

---

## 📈 Statistics

- **Lines of Code**: ~900 (JavaScript) + ~2100 (CSS) + ~500 (HTML)
- **Functions**: 40+
- **CSS Rules**: 150+
- **Responsive Breakpoints**: 3 (mobile, tablet, desktop)
- **Accessibility Features**: 15+
- **Storage Capacity**: ~50 MB (localStorage limit)

---

## 🎉 Getting Involved

- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🚀 Submit pull requests

---

**Happy grouping! 🚀**

Last updated: November 2025
