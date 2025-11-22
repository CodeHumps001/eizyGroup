# eizyGroup - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Server

```powershell
cd "C:\Users\code\Desktop\eizyGroup"
python -m http.server 8000
```

### 2. Open in Browser

```
http://localhost:8000
```

### 3. Create Account

- Click "Get Started" on landing page
- Enter name, email, password (6+ characters)
- Confirm password
- Click "Create Account"

### 4. Use Generator

- Go to Dashboard
- Paste student names (one per line)
- Set number of groups OR students per group
- Click "Generate Groups"
- Export as CSV if needed

## 📚 Documentation Files

| File                   | Purpose                                |
| ---------------------- | -------------------------------------- |
| **README.md**          | Complete project documentation         |
| **REFACTORING.md**     | Architecture and refactoring details   |
| **PROJECT_SUMMARY.md** | Project overview and completion status |

## 🏗️ Architecture Quick Reference

### Models (Data)

- `User`: Stores user account info
- `GroupGeneration`: Stores group data
- `AppState`: Central app state

### Presenters (Logic)

- `AuthPresenter`: Handles login/signup
- `GeneratorPresenter`: Handles group generation
- `HistoryPresenter`: Handles history
- `SettingsPresenter`: Handles settings

### Views (UI)

- `AuthView`: Login/signup UI
- `GeneratorView`: Generator UI
- `HistoryView`: History UI
- `SettingsView`: Settings UI

### Storage

- `StorageManager`: localStorage operations

### Controller

- `ApplicationController`: Main orchestrator

## 💻 Code Location

### Main Application

```
js/app.js
├── Lines 1-60: Models
├── Lines 65-300: Presenters
├── Lines 305-600: Views
├── Lines 605-700: StorageManager
└── Lines 705-1200: ApplicationController
```

## 🔑 Key Functions

### Authentication

```javascript
eApp.authPresenter.signup(name, email, password, confirmPassword);
eApp.authPresenter.login(email, password);
eApp.authPresenter.logout();
```

### Group Generation

```javascript
eApp.generatorPresenter.generateGroups(names, numGroups, perGroup);
eApp.generatorPresenter.exportAsCSV(groups);
eApp.generatorPresenter.parseCSV(csvContent);
```

### History

```javascript
eApp.historyPresenter.getHistory();
eApp.historyPresenter.addGeneration(names, groups, numGroups, perGroup);
eApp.historyPresenter.deleteGeneration(id);
eApp.historyPresenter.clearHistory();
```

### Settings

```javascript
eApp.settingsPresenter.setTheme("dark");
eApp.settingsPresenter.updatePreference("autoSave", true);
```

## 🎨 Features

| Feature               | Location         | Status |
| --------------------- | ---------------- | ------ |
| **User Auth**         | index.html modal | ✅     |
| **Group Generation**  | dashboard.html   | ✅     |
| **CSV Import/Export** | dashboard.html   | ✅     |
| **History Tracking**  | dashboard.html   | ✅     |
| **Dark Mode**         | dashboard.html   | ✅     |
| **Responsive Design** | All pages        | ✅     |
| **Accessibility**     | All pages        | ✅     |

## 🔧 Development Tips

### Debug the App

```javascript
// Access the global app instance
console.log(window.eApp);

// Get current user
eApp.appState.getCurrentUser();

// Get history
eApp.historyPresenter.getHistory();

// Get all storage data
eApp.storage.getUsers();
```

### Add a New Feature

1. **Create Model** (if needed)

```javascript
class MyFeature {
  constructor() {}
}
```

2. **Create Presenter**

```javascript
class MyPresenter {
  myMethod() {}
}
```

3. **Create View**

```javascript
class MyView {
  renderUI() {}
}
```

4. **Update Controller**

```javascript
// In ApplicationController constructor
this.myPresenter = new MyPresenter();
this.myView = new MyView();
```

5. **Setup Event Listeners**

```javascript
// In setupEventListeners()
element.addEventListener("click", () => this.myMethod());
```

## 📱 Testing Checklist

### Landing Page

- [ ] Navigate to http://localhost:8000
- [ ] Click "Get Started" button
- [ ] Signup modal appears
- [ ] Login modal switching works
- [ ] Dark mode toggle works

### Dashboard

- [ ] Login with test account
- [ ] Paste sample names (Alice, Bob, Charlie, etc.)
- [ ] Set number of groups to 2
- [ ] Click "Generate Groups"
- [ ] Groups render correctly
- [ ] Export CSV works
- [ ] View History tab
- [ ] View Settings tab

### Data Persistence

- [ ] Refresh page
- [ ] Still logged in
- [ ] History still there
- [ ] Preferences remembered

## 🐛 Troubleshooting

### App Won't Start

```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process using port 8000
taskkill /PID <PID> /F

# Try different port
python -m http.server 8001
```

### Data Not Saving

- Open Browser DevTools (F12)
- Go to Application → LocalStorage
- Look for keys starting with "eizyGroup\_"
- Clear and refresh if needed

### Dark Mode Not Working

- Check "dark-mode" class on body
- Verify CSS variables are set
- Check browser console for errors

## 📖 File Descriptions

### HTML Files

- **index.html**: Landing page with hero, features, testimonials, auth modals
- **dashboard.html**: Main app with generator, history, settings tabs

### CSS File

- **styles.css**: 2100+ lines of responsive, accessible styling
  - CSS variables for theming
  - Dark mode support
  - Responsive breakpoints (480px, 768px, 1024px)
  - WCAG AA color contrast

### JavaScript File

- **app.js**: 1200+ lines of refactored OOP/MVP code
  - 8 classes (Models, Presenters, Views)
  - 50+ methods
  - Clear separation of concerns
  - Well-documented

## 🚀 Deployment

### Local Testing

```powershell
python -m http.server 8000
```

### Production Deployment

- Use a proper web server (Apache, Nginx, etc.)
- Add HTTPS/SSL certificate
- Implement backend API
- Add database
- Set up authentication server
- Configure CORS headers

## 📞 Need Help?

1. **Check README.md** - Comprehensive documentation
2. **Check REFACTORING.md** - Architecture details
3. **Check browser console** - Error messages
4. **Review app.js comments** - Inline documentation

## ✨ What's New in This Version

✅ **Complete README.md** - Comprehensive project documentation
✅ **Refactored to OOP/MVP** - Clean architecture with separation of concerns
✅ **REFACTORING.md** - Detailed architecture guide
✅ **PROJECT_SUMMARY.md** - Project overview
✅ **QUICKSTART.md** - This file!

## 🎯 Quick Links

- **Documentation**: README.md
- **Architecture**: REFACTORING.md
- **Project Status**: PROJECT_SUMMARY.md
- **Main App**: js/app.js
- **Landing Page**: index.html
- **Dashboard**: dashboard.html
- **Styling**: css/styles.css

---

**Last Updated**: November 22, 2025
**Version**: 1.0.0
**Status**: ✅ Complete
