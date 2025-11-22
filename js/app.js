// ============ Authentication System for eizyGroup ============

// Simple in-memory user database (in production, this would be a backend server)
let users = JSON.parse(localStorage.getItem("eizyGroup_users")) || {};
let currentUser =
  JSON.parse(localStorage.getItem("eizyGroup_currentUser")) || null;

// Save users to localStorage
function saveUsers() {
  localStorage.setItem("eizyGroup_users", JSON.stringify(users));
}

// Save current user to localStorage
function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem("eizyGroup_currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("eizyGroup_currentUser");
  }
}

// Check if user is logged in
function isLoggedIn() {
  return currentUser !== null && currentUser !== undefined;
}

// Signup function
function signup(name, email, password, confirmPassword) {
  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showAuthMessage("signup", "All fields are required.", "error");
    return false;
  }
  if (password.length < 6) {
    showAuthMessage(
      "signup",
      "Password must be at least 6 characters.",
      "error"
    );
    return false;
  }
  if (password !== confirmPassword) {
    showAuthMessage("signup", "Passwords do not match.", "error");
    return false;
  }
  if (users[email]) {
    showAuthMessage(
      "signup",
      "An account with this email already exists.",
      "error"
    );
    return false;
  }

  // Create user
  users[email] = {
    email,
    name,
    password, // In production, this should be hashed!
    joinDate: new Date().toISOString(),
  };
  saveUsers();
  currentUser = { email, name, joinDate: users[email].joinDate };
  saveCurrentUser();

  showAuthMessage(
    "signup",
    "Account created successfully! Redirecting...",
    "success"
  );
  setTimeout(() => {
    hideSignupModal();
    redirectToDashboard();
  }, 1500);
  return true;
}

// Login function
function login(email, password) {
  // Validation
  if (!email || !password) {
    showAuthMessage("login", "Email and password are required.", "error");
    return false;
  }

  const user = users[email];
  if (!user) {
    showAuthMessage(
      "login",
      "User not found. Please check your email.",
      "error"
    );
    return false;
  }
  if (user.password !== password) {
    showAuthMessage("login", "Incorrect password.", "error");
    return false;
  }

  // Login successful
  currentUser = { email: user.email, name: user.name, joinDate: user.joinDate };
  saveCurrentUser();

  showAuthMessage("login", "Login successful! Redirecting...", "success");
  setTimeout(() => {
    hideLoginModal();
    redirectToDashboard();
  }, 1500);
  return true;
}

// Logout function
function logout() {
  currentUser = null;
  saveCurrentUser();
  window.location.href = "index.html";
}

// Show auth message
function showAuthMessage(modal, message, type) {
  const modalId = modal === "login" ? "login-modal" : "signup-modal";
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  let msgEl = modalEl.querySelector(".auth-message");
  if (!msgEl) {
    msgEl = document.createElement("div");
    msgEl.className = "auth-message";
    const form = modalEl.querySelector("form");
    form.insertBefore(msgEl, form.firstChild);
  }

  msgEl.className = `auth-message ${type}`;
  msgEl.textContent = message;
}

// Redirect to dashboard
function redirectToDashboard() {
  window.location.href = "dashboard.html";
}

// ============ UI Modal Functions ============

// Show/Hide Modals
function showLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.setAttribute("aria-hidden", "false");
    clearAuthMessages();
  }
}

function hideLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.setAttribute("aria-hidden", "true");
    document.getElementById("login-form").reset();
  }
}

function showSignupModal() {
  const modal = document.getElementById("signup-modal");
  if (modal) {
    modal.setAttribute("aria-hidden", "false");
    clearAuthMessages();
  }
}

function hideSignupModal() {
  const modal = document.getElementById("signup-modal");
  if (modal) {
    modal.setAttribute("aria-hidden", "true");
    document.getElementById("signup-form").reset();
  }
}

function switchToSignup() {
  hideLoginModal();
  showSignupModal();
}

function switchToLogin() {
  hideSignupModal();
  showLoginModal();
}

function clearAuthMessages() {
  const msgs = document.querySelectorAll(".auth-message");
  msgs.forEach((m) => m.remove());
}

// Form submission handlers
function onLoginSubmit() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  login(email, password);
}

function onSignupSubmit() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  signup(name, email, password, confirm);
}

// ============ Landing Page Login State Management ============

function updateNavigationForLoginState() {
  const isLogged = isLoggedIn();

  // Update login button in nav
  const loginBtn = document.getElementById("nav-login");
  const dashboardLink = document.getElementById("nav-dashboard");

  if (isLogged) {
    if (loginBtn) {
      loginBtn.textContent = "Account";
      loginBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = "dashboard.html";
      };
    }
    if (dashboardLink) {
      dashboardLink.style.display = "block";
    }
  } else {
    if (loginBtn) {
      loginBtn.textContent = "Login";
      loginBtn.onclick = (e) => {
        e.preventDefault();
        showLoginModal();
      };
    }
    if (dashboardLink) {
      dashboardLink.style.display = "none";
    }
  }

  // Update hero button
  const heroCTABtn = document.getElementById("hero-cta-btn");
  if (heroCTABtn) {
    if (isLogged) {
      heroCTABtn.textContent = "Visit Dashboard";
      heroCTABtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = "dashboard.html";
      };
    } else {
      heroCTABtn.textContent = "Get Started";
      heroCTABtn.onclick = (e) => {
        e.preventDefault();
        showSignupModal();
      };
    }
  }

  // Update CTA button
  const ctaBtn = document.getElementById("cta-button");
  if (ctaBtn) {
    if (isLogged) {
      ctaBtn.textContent = "Visit Dashboard";
      ctaBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = "dashboard.html";
      };
    } else {
      ctaBtn.textContent = "Get Started Now";
      ctaBtn.onclick = (e) => {
        e.preventDefault();
        showSignupModal();
      };
    }
  }
}

function handleHeroCTA() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
  } else {
    showSignupModal();
  }
}

function handleCTAButton() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
  } else {
    showSignupModal();
  }
}

// ============ Core UI Initialization ============

document.addEventListener("DOMContentLoaded", () => {
  // Set copyright year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = y;

  // Update navigation based on login state (for landing page)
  updateNavigationForLoginState();

  // Hook up login/signup links
  const loginLinks = document.querySelectorAll(
    "#nav-login, #nav-login-dashboard"
  );
  loginLinks.forEach(
    (a) =>
      a &&
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isLoggedIn()) {
          showLoginModal();
        }
      })
  );

  // Login modal controls
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel");
  const modalBackdrop = document.getElementById("modal-backdrop");
  if (modalClose) modalClose.addEventListener("click", hideLoginModal);
  if (modalCancel) modalCancel.addEventListener("click", hideLoginModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", hideLoginModal);

  // Signup modal controls
  const modalCloseSignup = document.getElementById("modal-close-signup");
  const modalCancelSignup = document.getElementById("modal-cancel-signup");
  const modalBackdropSignup = document.getElementById("modal-backdrop-signup");
  if (modalCloseSignup)
    modalCloseSignup.addEventListener("click", hideSignupModal);
  if (modalCancelSignup)
    modalCancelSignup.addEventListener("click", hideSignupModal);
  if (modalBackdropSignup)
    modalBackdropSignup.addEventListener("click", hideSignupModal);

  // Generate button (dashboard)
  const genBtn = document.getElementById("generate-btn");
  if (genBtn) genBtn.addEventListener("click", onGenerateClicked);

  // Dashboard link - require login
  const dashboardLink = document.getElementById("nav-dashboard");
  if (dashboardLink) {
    dashboardLink.addEventListener("click", (e) => {
      if (!isLoggedIn()) {
        e.preventDefault();
        showLoginModal();
      }
    });
  }

  // Update diagnostic status
  try {
    checkSystemStatus();
  } catch (e) {
    console.log("checkSystemStatus error", e);
  }
});

/* Placeholder: handleLogin - logs for debugging */
function handleLogin(email) {
  console.log("handleLogin called for", email);
}

/* Placeholder: generateGroups - logs for debugging */
function generateGroups(inputs) {
  console.log("generateGroups placeholder called with", inputs);
}

/* Placeholder: checkSystemStatus - logs for debugging */
function checkSystemStatus() {
  console.log("checkSystemStatus called");
  const diag = document.getElementById("diag-status");
  if (diag) diag.textContent = "OK";
}

// ============ Group History Management ============

let groupHistory = JSON.parse(localStorage.getItem("eizyGroup_history")) || [];

function saveGroupHistory() {
  localStorage.setItem("eizyGroup_history", JSON.stringify(groupHistory));
}

function addToHistory(names, groups, numGroups, perGroup) {
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    numStudents: names.length,
    numGroups: groups.length,
    groupConfig: { numGroups, perGroup },
    groups: groups.map((g) => [...g]),
  };
  groupHistory.unshift(entry); // Add to front
  if (groupHistory.length > 50) groupHistory.pop(); // Keep last 50
  saveGroupHistory();
}

function clearGroupHistory() {
  if (confirm("Are you sure? This will delete all saved group generations.")) {
    groupHistory = [];
    saveGroupHistory();
    renderHistory();
  }
}

// ============ Dashboard Functions ============

// Called when Generate Groups button is clicked
function onGenerateClicked() {
  const raw = document.getElementById("students-input")?.value || "";
  const numGroupsInput =
    parseInt(document.getElementById("num-groups")?.value || "0", 10) || 0;
  const perGroupInput =
    parseInt(document.getElementById("students-per-group")?.value || "0", 10) ||
    0;

  generateGroups({ raw, numGroupsInput, perGroupInput });

  const names = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (names.length === 0) {
    showResultsMessage("Please paste some student names to generate groups.");
    return;
  }

  const groups = computeGroups(names, numGroupsInput, perGroupInput);
  renderGroups(groups);

  // Show success message
  showAlert(
    `✓ Successfully generated ${groups.length} groups with ${names.length} students!`,
    "success"
  );

  // Save to history
  const autoSave = localStorage.getItem("eizyGroup_auto_save") !== "false";
  if (autoSave) {
    addToHistory(names, groups, numGroupsInput, perGroupInput);
  }

  // Show export button
  const exportSection = document.getElementById("export-section");
  if (exportSection) {
    exportSection.style.display = "block";
  }

  // Store current groups for export
  window.currentGroups = { names, groups };
}

function showResultsMessage(msg) {
  const results = document.getElementById("results");
  if (results) {
    results.innerHTML = `<div class="welcome">${msg}</div>`;
  }
}

function computeGroups(names, numGroups, perGroup) {
  const arr = names.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  let k = numGroups || 0;
  if (k <= 0 && perGroup > 0) k = Math.ceil(arr.length / perGroup);
  if (k <= 0) k = Math.max(1, Math.round(arr.length / 3));

  const out = Array.from({ length: k }, () => []);
  for (let i = 0; i < arr.length; i++) {
    out[i % k].push(arr[i]);
  }
  return out;
}

function renderGroups(groups) {
  const results = document.getElementById("results");
  if (!results) return;
  const wrapper = document.createElement("div");
  wrapper.className = "groups";

  groups.forEach((g, idx) => {
    const card = document.createElement("div");
    card.className = "group-card";

    // Header with group number and count
    const header = document.createElement("div");
    header.className = "group-card-header";

    const title = document.createElement("h4");
    title.textContent = `Group ${idx + 1}`;

    const count = document.createElement("span");
    count.className = "group-card-count";
    count.textContent = `${g.length} students`;

    header.appendChild(title);
    header.appendChild(count);
    card.appendChild(header);

    // Student list
    const ul = document.createElement("ul");
    g.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      ul.appendChild(li);
    });
    card.appendChild(ul);
    wrapper.appendChild(card);
  });

  results.innerHTML = "";
  results.appendChild(wrapper);
}

// ============ Dark Mode Toggle ============

function initThemeToggle() {
  const savedTheme = localStorage.getItem("eizyGroup_theme") || "light";
  if (savedTheme === "dark") {
    document.getElementById("app-body").classList.add("dark-mode");
    updateThemeIcon();
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  const body = document.getElementById("app-body");
  if (!body) return;

  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("eizyGroup_theme", isDark ? "dark" : "light");
  updateThemeIcon();
}

function updateThemeIcon() {
  const body = document.getElementById("app-body");
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  }
}

// ============ Alert System ============

function showAlert(message, type = "success") {
  // Create alert element
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  const isDarkMode = document
    .getElementById("app-body")
    ?.classList.contains("dark-mode");

  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 14px 20px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
  `;

  if (type === "success") {
    if (isDarkMode) {
      alert.style.backgroundColor = "#064e3b";
      alert.style.color = "#d1fae5";
      alert.style.border = "1px solid #047857";
    } else {
      alert.style.backgroundColor = "#d1fae5";
      alert.style.color = "#065f46";
      alert.style.border = "1px solid #6ee7b7";
    }
  } else if (type === "error") {
    if (isDarkMode) {
      alert.style.backgroundColor = "#7f1d1d";
      alert.style.color = "#fee2e2";
      alert.style.border = "1px solid #dc2626";
    } else {
      alert.style.backgroundColor = "#fee2e2";
      alert.style.color = "#991b1b";
      alert.style.border = "1px solid #fca5a5";
    }
  }

  document.body.appendChild(alert);

  // Remove after 4 seconds
  setTimeout(() => {
    alert.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 4000);
}

// Add animations to head
if (!document.querySelector("style[data-alert-animations]")) {
  const style = document.createElement("style");
  style.setAttribute("data-alert-animations", "true");
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ============ Tab Switching ============

function switchTab(tabName) {
  // Hide all tabs
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((tab) => tab.classList.remove("active"));

  // Deactivate all tab buttons
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => btn.classList.remove("active"));

  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  // Activate selected tab button
  const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add("active");
  }

  // Load content if needed
  if (tabName === "history") {
    renderHistory();
  } else if (tabName === "settings") {
    initSettings();
  }
}

// ============ History Management ============

function renderHistory() {
  const historyList = document.getElementById("history-list");
  if (!historyList) return;

  if (groupHistory.length === 0) {
    historyList.innerHTML =
      '<div class="welcome">No generations yet. Create groups in the Generator tab to see them here.</div>';
    return;
  }

  const html = groupHistory
    .map((entry) => {
      const date = new Date(entry.timestamp);
      const dateStr =
        date.toLocaleDateString() + " " + date.toLocaleTimeString();
      const groupsStr = entry.groups
        .map((g, idx) => `Group ${idx + 1}: ${g.length} students`)
        .join(", ");

      return `
        <div class="history-item">
          <div class="history-item-header">
            <div class="history-item-title">${entry.numStudents} students → ${entry.numGroups} groups</div>
            <div class="history-item-date">${dateStr}</div>
          </div>
          <div class="history-item-details">
            <div class="history-item-stats">${groupsStr}</div>
            <div class="history-item-actions">
              <button class="btn btn-small btn-ghost" onclick="loadFromHistory(${entry.id})">Load</button>
              <button class="btn btn-small btn-ghost" onclick="deleteFromHistory(${entry.id})">Delete</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  historyList.innerHTML = html;
}

function loadFromHistory(historyId) {
  const entry = groupHistory.find((h) => h.id === historyId);
  if (!entry) return;

  // Switch to generator tab
  switchTab("generator");

  // Clear current input
  const studentsInput = document.getElementById("students-input");
  if (studentsInput) {
    studentsInput.value = entry.groups.map((g) => g.join("\n")).join("\n");
  }

  // Render the groups
  renderGroups(entry.groups);
  window.currentGroups = { names: entry.groups.flat(), groups: entry.groups };

  // Show export button
  const exportSection = document.getElementById("export-section");
  if (exportSection) {
    exportSection.style.display = "block";
  }
}

function deleteFromHistory(historyId) {
  if (confirm("Delete this generation from history?")) {
    groupHistory = groupHistory.filter((h) => h.id !== historyId);
    saveGroupHistory();
    renderHistory();
  }
}

// ============ CSV Export ============

function exportGroupsAsCSV() {
  if (!window.currentGroups || !window.currentGroups.groups) {
    showAlert("No groups to export. Generate groups first.", "error");
    return;
  }

  const groups = window.currentGroups.groups;
  let csv = "Group,Student\n";

  groups.forEach((group, groupIdx) => {
    group.forEach((student, studentIdx) => {
      csv += `${groupIdx + 1},"${student}"\n`;
    });
  });

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `groups_${new Date().getTime()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showAlert("✓ Groups exported successfully as CSV!", "success");
}

// ============ Settings Management ============

function initSettings() {
  // Display user info
  const user = currentUser;
  if (user) {
    const nameEl = document.getElementById("settings-name");
    const emailEl = document.getElementById("settings-email");
    const joinedEl = document.getElementById("settings-joined");

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (joinedEl) {
      const joinDate = user.joinDate
        ? new Date(user.joinDate).toLocaleDateString()
        : "Unknown";
      joinedEl.textContent = joinDate;
    }
  }

  // Set preferences
  const darkModeCheckbox = document.getElementById("dark-mode-pref");
  const autoSaveCheckbox = document.getElementById("auto-save-pref");

  if (darkModeCheckbox) {
    darkModeCheckbox.checked = document
      .getElementById("app-body")
      .classList.contains("dark-mode");
    darkModeCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        document.getElementById("app-body").classList.add("dark-mode");
        localStorage.setItem("eizyGroup_theme", "dark");
      } else {
        document.getElementById("app-body").classList.remove("dark-mode");
        localStorage.setItem("eizyGroup_theme", "light");
      }
      updateThemeIcon();
    });
  }

  if (autoSaveCheckbox) {
    const autoSave = localStorage.getItem("eizyGroup_auto_save") !== "false";
    autoSaveCheckbox.checked = autoSave;
    autoSaveCheckbox.addEventListener("change", (e) => {
      localStorage.setItem(
        "eizyGroup_auto_save",
        e.target.checked ? "true" : "false"
      );
    });
  }

  // Clear history button
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearGroupHistory);
  }
}

// ============ CSV Import ============

function initCSVImport() {
  const csvInput = document.getElementById("csv-import");
  if (!csvInput) return;

  csvInput.addEventListener("change", handleCSVImport);
}

function handleCSVImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const csv = event.target.result;
      const lines = csv.split("\n").map((line) => line.trim());

      // Extract names (first column or first cell if comma-separated)
      const names = lines
        .filter((line) => line.length > 0)
        .map((line) => {
          // Handle CSV: take first column (before comma)
          const parts = line.split(",");
          return parts[0].trim();
        })
        .filter((name) => name.length > 0);

      if (names.length === 0) {
        showAlert("No valid names found in CSV file.", "error");
        return;
      }

      // Populate textarea
      const textarea = document.getElementById("students-input");
      if (textarea) {
        textarea.value = names.join("\n");
      }

      showAlert(
        `✓ Successfully imported ${names.length} students from CSV!`,
        "success"
      );
      // Reset file input
      e.target.value = "";
    } catch (err) {
      showAlert("Error parsing CSV file: " + err.message, "error");
      e.target.value = "";
    }
  };

  reader.readAsText(file);
}

// Expose to global scope
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.currentUser = () => currentUser;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.handleHeroCTA = handleHeroCTA;
window.handleCTAButton = handleCTAButton;
window.updateNavigationForLoginState = updateNavigationForLoginState;
