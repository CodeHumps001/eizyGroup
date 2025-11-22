// ============================================================
// eizyGroup - OOP/MVP Architecture Refactored Version
// ============================================================
// This version implements Object-Oriented Programming with
// Model-View-Presenter (MVP) architecture for better
// maintainability, testability, and scalability.
// ============================================================

// ============================================================
// MODELS - Data Layer (Business Objects)
// ============================================================

/**
 * User Model - Represents a user in the system
 */
class User {
  constructor(email, name, password, joinDate = new Date().toISOString()) {
    this.email = email;
    this.name = name;
    this.password = password; // TODO: Hash in production
    this.joinDate = joinDate;
  }

  toJSON() {
    return {
      email: this.email,
      name: this.name,
      password: this.password,
      joinDate: this.joinDate,
    };
  }

  static fromJSON(data) {
    return new User(data.email, data.name, data.password, data.joinDate);
  }

  isValid() {
    return this.email && this.name && this.password;
  }
}

/**
 * GroupGeneration Model - Represents a group generation event
 */
class GroupGeneration {
  constructor(names, groups, numGroups, perGroup) {
    this.id = Date.now();
    this.timestamp = new Date().toISOString();
    this.numStudents = names.length;
    this.numGroups = groups.length;
    this.groupConfig = { numGroups, perGroup };
    this.groups = groups.map((g) => [...g]); // Deep copy
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      numStudents: this.numStudents,
      numGroups: this.numGroups,
      groupConfig: this.groupConfig,
      groups: this.groups,
    };
  }

  static fromJSON(data) {
    const gen = new GroupGeneration([], [], 0, 0);
    Object.assign(gen, data);
    return gen;
  }

  getFormattedDate() {
    const date = new Date(this.timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  getGroupsSummary() {
    return this.groups
      .map((g, idx) => `Group ${idx + 1}: ${g.length} students`)
      .join(", ");
  }
}

/**
 * AppState Model - Central state management
 */
class AppState {
  constructor() {
    this.currentUser = null;
    this.groupHistory = [];
    this.currentGroups = null;
    this.currentStatistics = null;
    this.theme = "light";
    this.preferences = {
      autoSave: true,
      darkMode: false,
    };
    this.performanceMetrics = {
      totalGroupsGenerated: 0,
      totalStudentsProcessed: 0,
      averageBalanceScore: 0,
      averageDiversityScore: 0,
      generationHistory: [],
    };
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  addToHistory(generation) {
    this.groupHistory.unshift(generation);
    if (this.groupHistory.length > 50) {
      this.groupHistory.pop();
    }
  }

  getHistory() {
    return this.groupHistory;
  }

  clearHistory() {
    this.groupHistory = [];
  }

  setCurrentGroups(groups) {
    this.currentGroups = groups;
  }

  getCurrentGroups() {
    return this.currentGroups;
  }

  setCurrentStatistics(statistics) {
    this.currentStatistics = statistics;
  }

  getCurrentStatistics() {
    return this.currentStatistics;
  }

  addPerformanceMetric(statistics) {
    this.performanceMetrics.totalGroupsGenerated += statistics.totalGroups;
    this.performanceMetrics.totalStudentsProcessed += statistics.totalStudents;

    // Update average scores
    const prevCount = this.performanceMetrics.generationHistory.length;
    const newCount = prevCount + 1;

    this.performanceMetrics.averageBalanceScore =
      (this.performanceMetrics.averageBalanceScore * prevCount +
        statistics.balanceScore) /
      newCount;
    this.performanceMetrics.averageDiversityScore =
      (this.performanceMetrics.averageDiversityScore * prevCount +
        statistics.diversityScore) /
      newCount;

    this.performanceMetrics.generationHistory.push({
      timestamp: new Date().toISOString(),
      ...statistics,
    });

    // Keep last 100 entries
    if (this.performanceMetrics.generationHistory.length > 100) {
      this.performanceMetrics.generationHistory.shift();
    }
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }
}

// ============================================================
// PRESENTERS - Business Logic Layer
// ============================================================

/**
 * AuthPresenter - Handles authentication logic
 */
class AuthPresenter {
  constructor(storageManager, appState) {
    this.storage = storageManager;
    this.appState = appState;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    return password && password.length >= 6;
  }

  validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  signup(name, email, password, confirmPassword) {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    if (!this.validateEmail(email)) {
      return {
        success: false,
        message: "Please enter a valid email.",
      };
    }

    if (!this.validatePassword(password)) {
      return {
        success: false,
        message: "Password must be at least 6 characters.",
      };
    }

    if (!this.validatePasswordMatch(password, confirmPassword)) {
      return {
        success: false,
        message: "Passwords do not match.",
      };
    }

    if (this.storage.userExists(email)) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // Create user
    const user = new User(email, name, password);
    this.storage.saveUser(user);
    this.appState.setCurrentUser({
      email: user.email,
      name: user.name,
      joinDate: user.joinDate,
    });

    return {
      success: true,
      message: "Account created successfully!",
      user: this.appState.getCurrentUser(),
    };
  }

  login(email, password) {
    // Validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    const user = this.storage.getUser(email);
    if (!user) {
      return {
        success: false,
        message: "User not found. Please check your email.",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "Incorrect password.",
      };
    }

    this.appState.setCurrentUser({
      email: user.email,
      name: user.name,
      joinDate: user.joinDate,
    });

    return {
      success: true,
      message: "Login successful!",
      user: this.appState.getCurrentUser(),
    };
  }

  logout() {
    this.appState.setCurrentUser(null);
    return { success: true, message: "Logged out successfully." };
  }
}

/**
 * GeneratorPresenter - Handles group generation logic
 */
class GeneratorPresenter {
  constructor() {}

  /**
   * Validate input parameters
   */
  validateInput(names, numGroups, perGroup) {
    if (!names || names.length === 0) {
      return { valid: false, error: "Please enter at least one student name." };
    }

    if (numGroups <= 0 && perGroup <= 0) {
      return {
        valid: false,
        error: "Please specify either number of groups or students per group.",
      };
    }

    return { valid: true };
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  randomizeArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Distribute names into groups
   */
  distributeIntoGroups(names, numGroups, perGroup) {
    const validation = this.validateInput(names, numGroups, perGroup);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const shuffled = this.randomizeArray(names);
    let k = numGroups || 0;

    if (k <= 0 && perGroup > 0) {
      k = Math.ceil(shuffled.length / perGroup);
    }
    if (k <= 0) {
      k = Math.max(1, Math.round(shuffled.length / 3));
    }

    const groups = Array.from({ length: k }, () => []);
    for (let i = 0; i < shuffled.length; i++) {
      groups[i % k].push(shuffled[i]);
    }

    return groups;
  }

  /**
   * Generate groups from input
   */
  generateGroups(names, numGroups, perGroup) {
    try {
      const cleanedNames = names
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const groups = this.distributeIntoGroups(
        cleanedNames,
        parseInt(numGroups) || 0,
        parseInt(perGroup) || 0
      );

      return {
        success: true,
        groups,
        message: `Successfully generated ${groups.length} groups with ${cleanedNames.length} students!`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Export groups to CSV format
   */
  exportAsCSV(groups) {
    let csv = "Group,Student\n";
    groups.forEach((group, groupIdx) => {
      group.forEach((student) => {
        csv += `${groupIdx + 1},"${student}"\n`;
      });
    });
    return csv;
  }

  /**
   * Parse CSV file
   */
  parseCSV(csv) {
    const lines = csv.split("\n").map((line) => line.trim());
    const names = lines
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split(",");
        return parts[0].trim();
      })
      .filter((name) => name.length > 0);

    return names;
  }

  /**
   * Calculate statistics for groups
   */
  calculateStatistics(groups, allNames) {
    const totalStudents = allNames.length;
    const totalGroups = groups.length;
    const avgGroupSize = (totalStudents / totalGroups).toFixed(2);
    const minGroupSize = Math.min(...groups.map((g) => g.length));
    const maxGroupSize = Math.max(...groups.map((g) => g.length));

    // Calculate balance score (0-100, higher is more balanced)
    const variance =
      groups.reduce((sum, group) => {
        return sum + Math.pow(group.length - avgGroupSize, 2);
      }, 0) / totalGroups;
    const balanceScore = Math.round(100 - Math.min(variance * 20, 100));

    // Calculate diversity (no duplicates = 100)
    const uniqueStudents = new Set(allNames).size;
    const diversityScore = Math.round((uniqueStudents / totalStudents) * 100);

    return {
      totalStudents,
      totalGroups,
      avgGroupSize,
      minGroupSize,
      maxGroupSize,
      balanceScore,
      diversityScore,
    };
  }

  /**
   * Format groups as text for copying
   */
  formatGroupsAsText(groups) {
    let text = "GROUP ASSIGNMENTS\n";
    text += "=".repeat(50) + "\n\n";

    groups.forEach((group, idx) => {
      text += `Group ${idx + 1} (${group.length} students):\n`;
      text += "-".repeat(40) + "\n";
      group.forEach((student, i) => {
        text += `${i + 1}. ${student}\n`;
      });
      text += "\n";
    });

    return text;
  }

  /**
   * Generate duplicate pairings report
   */
  generateDuplicateReport(currentGroups, previousGroupings) {
    const pairings = new Map();
    const duplicates = [];

    // Build current pairings
    currentGroups.forEach((group) => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const pair = [group[i], group[j]].sort().join("|");
          pairings.set(pair, (pairings.get(pair) || 0) + 1);
        }
      }
    });

    // Check against history
    previousGroupings.forEach((prevGen) => {
      if (!prevGen.groups) return;
      prevGen.groups.forEach((group) => {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const pair = [group[i], group[j]].sort().join("|");
            if (pairings.has(pair)) {
              duplicates.push({
                pair: [group[i], group[j]],
                previousDate: prevGen.timestamp,
              });
            }
          }
        }
      });
    });

    return {
      duplicateCount: duplicates.length,
      duplicates,
      pairingDetails: Object.fromEntries(pairings),
    };
  }
}

/**
 * HistoryPresenter - Handles history management logic
 */
class HistoryPresenter {
  constructor(appState, storageManager) {
    this.appState = appState;
    this.storage = storageManager;
  }

  addGeneration(names, groups, numGroups, perGroup) {
    const generation = new GroupGeneration(names, groups, numGroups, perGroup);
    this.appState.addToHistory(generation);
    this.storage.saveHistory(this.appState.getHistory());
    return generation;
  }

  getHistory() {
    return this.appState.getHistory();
  }

  deleteGeneration(id) {
    const history = this.appState.getHistory();
    const filtered = history.filter((h) => h.id !== id);
    this.appState.groupHistory = filtered;
    this.storage.saveHistory(filtered);
    return true;
  }

  loadGeneration(id) {
    const entry = this.appState.getHistory().find((h) => h.id === id);
    return entry;
  }

  clearHistory() {
    this.appState.clearHistory();
    this.storage.saveHistory([]);
    return true;
  }
}

/**
 * SettingsPresenter - Handles settings logic
 */
class SettingsPresenter {
  constructor(appState, storageManager) {
    this.appState = appState;
    this.storage = storageManager;
  }

  getTheme() {
    return this.appState.theme;
  }

  setTheme(theme) {
    this.appState.theme = theme;
    this.storage.saveTheme(theme);
  }

  getPreferences() {
    return this.appState.preferences;
  }

  updatePreference(key, value) {
    this.appState.preferences[key] = value;
    this.storage.savePreferences(this.appState.preferences);
  }

  getCurrentUser() {
    return this.appState.getCurrentUser();
  }
}

// ============================================================
// VIEWS - UI Layer
// ============================================================

/**
 * AuthView - Handles authentication UI
 */
class AuthView {
  constructor() {}

  showMessage(modal, message, type) {
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

  clearMessages() {
    const msgs = document.querySelectorAll(".auth-message");
    msgs.forEach((m) => m.remove());
  }

  showLoginForm() {
    const modal = document.getElementById("login-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      this.clearMessages();
    }
  }

  hideLoginForm() {
    const modal = document.getElementById("login-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "true");
      const form = document.getElementById("login-form");
      if (form) form.reset();
    }
  }

  showSignupForm() {
    const modal = document.getElementById("signup-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      this.clearMessages();
    }
  }

  hideSignupForm() {
    const modal = document.getElementById("signup-modal");
    if (modal) {
      modal.setAttribute("aria-hidden", "true");
      const form = document.getElementById("signup-form");
      if (form) form.reset();
    }
  }

  getLoginCredentials() {
    return {
      email: document.getElementById("login-email")?.value.trim() || "",
      password: document.getElementById("login-password")?.value || "",
    };
  }

  getSignupData() {
    return {
      name: document.getElementById("signup-name")?.value.trim() || "",
      email: document.getElementById("signup-email")?.value.trim() || "",
      password: document.getElementById("signup-password")?.value || "",
      confirmPassword: document.getElementById("signup-confirm")?.value || "",
    };
  }

  updateNavigation(isLoggedIn) {
    const loginBtn = document.getElementById("nav-login");
    const dashboardLink = document.getElementById("nav-dashboard");

    if (isLoggedIn) {
      if (loginBtn) {
        loginBtn.textContent = "Account";
        loginBtn.onclick = () => (window.location.href = "dashboard.html");
      }
      if (dashboardLink) dashboardLink.style.display = "block";
    } else {
      if (loginBtn) {
        loginBtn.textContent = "Login";
        loginBtn.onclick = () => this.showLoginForm();
      }
      if (dashboardLink) dashboardLink.style.display = "none";
    }
  }

  updateCTAButtons(isLoggedIn) {
    const heroCTABtn = document.getElementById("hero-cta-btn");
    const ctaBtn = document.getElementById("cta-button");

    if (isLoggedIn) {
      if (heroCTABtn) {
        heroCTABtn.textContent = "Visit Dashboard";
        heroCTABtn.onclick = () => (window.location.href = "dashboard.html");
      }
      if (ctaBtn) {
        ctaBtn.textContent = "Visit Dashboard";
        ctaBtn.onclick = () => (window.location.href = "dashboard.html");
      }
    } else {
      if (heroCTABtn) {
        heroCTABtn.textContent = "Get Started";
        heroCTABtn.onclick = () => this.showSignupForm();
      }
      if (ctaBtn) {
        ctaBtn.textContent = "Get Started Now";
        ctaBtn.onclick = () => this.showSignupForm();
      }
    }
  }
}

/**
 * GeneratorView - Handles group generator UI
 */
class GeneratorView {
  constructor() {}

  getStudentInput() {
    return document.getElementById("students-input")?.value || "";
  }

  setStudentInput(value) {
    const textarea = document.getElementById("students-input");
    if (textarea) textarea.value = value;
  }

  getGroupConfig() {
    return {
      numGroups:
        parseInt(document.getElementById("num-groups")?.value || "0") || 0,
      perGroup:
        parseInt(document.getElementById("students-per-group")?.value || "0") ||
        0,
    };
  }

  renderGroups(groups) {
    const results = document.getElementById("results");
    if (!results) return;

    const wrapper = document.createElement("div");
    wrapper.className = "groups";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-live", "polite");
    wrapper.setAttribute("aria-label", "Generated groups");

    groups.forEach((g, idx) => {
      const card = document.createElement("div");
      card.className = "group-card";

      const header = document.createElement("div");
      header.className = "group-card-header";

      const title = document.createElement("h4");
      title.textContent = `Group ${idx + 1}`;

      const count = document.createElement("span");
      count.className = "group-card-count";
      count.setAttribute("aria-label", `${g.length} students`);
      count.textContent = `${g.length} students`;

      header.appendChild(title);
      header.appendChild(count);
      card.appendChild(header);

      const ul = document.createElement("ul");
      ul.setAttribute("role", "list");
      g.forEach((name) => {
        const li = document.createElement("li");
        li.setAttribute("role", "listitem");
        li.textContent = name;
        ul.appendChild(li);
      });
      card.appendChild(ul);
      wrapper.appendChild(card);
    });

    results.innerHTML = "";
    results.appendChild(wrapper);
  }

  displayMessage(message, type = "info") {
    const results = document.getElementById("results");
    if (results) {
      results.innerHTML = `<div class="welcome">${message}</div>`;
    }
  }

  showExportButton(show = true) {
    const exportSection = document.getElementById("export-section");
    if (exportSection) {
      exportSection.style.display = show ? "block" : "none";
    }
  }

  showAlert(message, type = "success") {
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

    setTimeout(() => {
      alert.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => alert.remove(), 300);
    }, 4000);
  }

  /**
   * Display statistics panel
   */
  showStatisticsPanel(statistics) {
    const resultsSection = document.getElementById("results");
    if (!resultsSection) return;

    const statsPanel = document.createElement("div");
    statsPanel.className = "stats-panel";
    statsPanel.setAttribute("role", "region");
    statsPanel.setAttribute("aria-label", "Group statistics");
    statsPanel.innerHTML = `
      <div class="stats-header">
        <h3>📊 Group Statistics</h3>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Total Students</div>
          <div class="stat-value">${statistics.totalStudents}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Groups</div>
          <div class="stat-value">${statistics.totalGroups}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg Group Size</div>
          <div class="stat-value">${statistics.avgGroupSize}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Min/Max Size</div>
          <div class="stat-value">${statistics.minGroupSize}/${
      statistics.maxGroupSize
    }</div>
        </div>
        <div class="stat-item highlight">
          <div class="stat-label">Balance Score</div>
          <div class="stat-value score-${
            statistics.balanceScore > 80
              ? "high"
              : statistics.balanceScore > 60
              ? "medium"
              : "low"
          }">${statistics.balanceScore}%</div>
        </div>
        <div class="stat-item highlight">
          <div class="stat-label">Diversity Score</div>
          <div class="stat-value score-${
            statistics.diversityScore > 80
              ? "high"
              : statistics.diversityScore > 60
              ? "medium"
              : "low"
          }">${statistics.diversityScore}%</div>
        </div>
      </div>
    `;

    resultsSection.insertAdjacentElement("afterbegin", statsPanel);
  }

  /**
   * Copy groups to clipboard
   */
  async copyToClipboard(formattedText) {
    try {
      await navigator.clipboard.writeText(formattedText);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = formattedText;
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  }

  /**
   * Show duplicate prevention report
   */
  showDuplicateReport(report) {
    if (report.duplicateCount === 0) {
      this.showAlert("✓ No duplicate pairings found! Fresh groups.", "success");
      return;
    }

    const message = `⚠️ Found ${report.duplicateCount} duplicate pairing(s) from history`;
    this.showAlert(message, "error");
  }

  /**
   * Render group size distribution chart
   */
  renderGroupSizeChart(groups) {
    const resultsSection = document.getElementById("results");
    if (!resultsSection) return;

    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    chartContainer.innerHTML = `
      <div class="chart-header">📊 Group Size Distribution</div>
      <div class="size-chart">
        ${groups
          .map((g, idx) => {
            const percentage =
              (g.length / Math.max(...groups.map((gr) => gr.length))) * 100;
            return `
            <div class="size-bar" style="height: ${percentage}%;" title="Group ${
              idx + 1
            }: ${g.length} students">
              <span class="bar-label">${g.length}</span>
            </div>
          `;
          })
          .join("")}
      </div>
    `;

    resultsSection.insertAdjacentElement("afterbegin", chartContainer);
  }

  /**
   * Render performance trends chart
   */
  renderPerformanceTrend(performanceMetrics) {
    if (
      !performanceMetrics.generationHistory ||
      performanceMetrics.generationHistory.length === 0
    ) {
      return;
    }

    const resultsSection = document.getElementById("results");
    if (!resultsSection) return;

    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container performance-chart";

    const history = performanceMetrics.generationHistory.slice(-10); // Last 10
    const avgBalance = performanceMetrics.averageBalanceScore.toFixed(1);
    const avgDiversity = performanceMetrics.averageDiversityScore.toFixed(1);

    chartContainer.innerHTML = `
      <div class="chart-header">📈 Performance Trends (Last 10 Generations)</div>
      <div class="performance-grid">
        <div class="performance-item">
          <div class="perf-metric">
            <div class="metric-name">Avg Balance Score</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${avgBalance}%; background: linear-gradient(90deg, #ff9800, #4caf50);"></div>
            </div>
            <div class="metric-value">${avgBalance}%</div>
          </div>
        </div>
        <div class="performance-item">
          <div class="perf-metric">
            <div class="metric-name">Avg Diversity Score</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${avgDiversity}%; background: linear-gradient(90deg, #ff9800, #4caf50);"></div>
            </div>
            <div class="metric-value">${avgDiversity}%</div>
          </div>
        </div>
        <div class="performance-item">
          <div class="perf-metric">
            <div class="metric-name">Total Generated</div>
            <div class="metric-value">${performanceMetrics.totalGroupsGenerated}</div>
            <div class="metric-subtext">groups</div>
          </div>
        </div>
        <div class="performance-item">
          <div class="perf-metric">
            <div class="metric-name">Total Students</div>
            <div class="metric-value">${performanceMetrics.totalStudentsProcessed}</div>
            <div class="metric-subtext">processed</div>
          </div>
        </div>
      </div>
    `;

    resultsSection.insertAdjacentElement("afterbegin", chartContainer);
  }
}

/**
 * HistoryView - Handles history UI
 */
class HistoryView {
  constructor() {}

  renderHistory(entries) {
    const historyList = document.getElementById("history-list");
    if (!historyList) return;

    // Ensure entries is an array
    if (!Array.isArray(entries)) {
      entries = [];
    }

    if (entries.length === 0) {
      historyList.innerHTML =
        '<div class="welcome">No generations yet. Create groups in the Generator tab to see them here.</div>';
      return;
    }

    const html = entries
      .map((entry) => {
        // Ensure entry is a GroupGeneration instance with methods
        const formattedDate = entry.getFormattedDate
          ? entry.getFormattedDate()
          : new Date(entry.timestamp).toLocaleDateString();
        const groupsSummary = entry.getGroupsSummary
          ? entry.getGroupsSummary()
          : `${entry.numGroups || 0} groups`;

        return `
        <div class="history-item">
          <div class="history-item-header">
            <div class="history-item-title">${
              entry.numStudents || 0
            } students → ${entry.numGroups || 0} groups</div>
            <div class="history-item-date">${formattedDate}</div>
          </div>
          <div class="history-item-details">
            <div class="history-item-stats">${groupsSummary}</div>
            <div class="history-item-actions">
              <button class="btn btn-small btn-ghost" onclick="window.eApp.loadFromHistory(${
                entry.id
              })">Load</button>
              <button class="btn btn-small btn-ghost" onclick="window.eApp.deleteFromHistory(${
                entry.id
              })">Delete</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    historyList.innerHTML = html;
  }

  displayEmptyState() {
    const historyList = document.getElementById("history-list");
    if (historyList) {
      historyList.innerHTML =
        '<div class="welcome">No generations yet. Create groups in the Generator tab to see them here.</div>';
    }
  }
}

/**
 * SettingsView - Handles settings UI
 */
class SettingsView {
  constructor() {}

  renderUserInfo(user) {
    if (!user) return;

    const nameEl = document.getElementById("settings-name");
    const emailEl = document.getElementById("settings-email");
    const joinedEl = document.getElementById("settings-joined");

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (joinedEl) {
      const joinDate = new Date(user.joinDate).toLocaleDateString();
      joinedEl.textContent = joinDate;
    }
  }

  renderPreferences(preferences) {
    const darkModeCheckbox = document.getElementById("dark-mode-pref");
    const autoSaveCheckbox = document.getElementById("auto-save-pref");

    if (darkModeCheckbox) {
      darkModeCheckbox.checked = preferences.darkMode;
    }
    if (autoSaveCheckbox) {
      autoSaveCheckbox.checked = preferences.autoSave;
    }
  }

  getDarkModeCheckbox() {
    return document.getElementById("dark-mode-pref");
  }

  getAutoSaveCheckbox() {
    return document.getElementById("auto-save-pref");
  }

  showMessage(message, type = "success") {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

// ============================================================
// STORAGE MANAGER - Data Persistence
// ============================================================

/**
 * StorageManager - Handles all localStorage operations
 */
class StorageManager {
  constructor() {
    this.PREFIX = "eizyGroup_";
  }

  // User storage
  saveUser(user) {
    const users = this.getUsers();
    users[user.email] = user.toJSON();
    localStorage.setItem(this.PREFIX + "users", JSON.stringify(users));
  }

  getUser(email) {
    const users = this.getUsers();
    return users[email] ? User.fromJSON(users[email]) : null;
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.PREFIX + "users")) || {};
  }

  userExists(email) {
    return !!this.getUsers()[email];
  }

  // Current user storage
  saveCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.PREFIX + "currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem(this.PREFIX + "currentUser");
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.PREFIX + "currentUser");
    return user ? JSON.parse(user) : null;
  }

  // History storage
  saveHistory(history) {
    localStorage.setItem(
      this.PREFIX + "history",
      JSON.stringify(history.map((h) => h.toJSON()))
    );
  }

  getHistory() {
    const history =
      JSON.parse(localStorage.getItem(this.PREFIX + "history")) || [];
    return history.map((h) => GroupGeneration.fromJSON(h));
  }

  // Theme storage
  saveTheme(theme) {
    localStorage.setItem(this.PREFIX + "theme", theme);
  }

  getTheme() {
    return localStorage.getItem(this.PREFIX + "theme") || "light";
  }

  // Preferences storage
  savePreferences(prefs) {
    localStorage.setItem(this.PREFIX + "preferences", JSON.stringify(prefs));
  }

  getPreferences() {
    return JSON.parse(localStorage.getItem(this.PREFIX + "preferences")) || {};
  }

  // Statistics/Metrics storage
  saveStatistics(statistics) {
    localStorage.setItem(
      this.PREFIX + "currentStatistics",
      JSON.stringify(statistics)
    );
  }

  getStatistics() {
    return (
      JSON.parse(localStorage.getItem(this.PREFIX + "currentStatistics")) ||
      null
    );
  }

  savePerformanceMetrics(metrics) {
    localStorage.setItem(
      this.PREFIX + "performanceMetrics",
      JSON.stringify(metrics)
    );
  }

  getPerformanceMetrics() {
    return (
      JSON.parse(localStorage.getItem(this.PREFIX + "performanceMetrics")) || {
        totalGroupsGenerated: 0,
        totalStudentsProcessed: 0,
        averageBalanceScore: 0,
        averageDiversityScore: 0,
        generationHistory: [],
      }
    );
  }

  // Clear all data
  clearAll() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }
}

// ============================================================
// APPLICATION CONTROLLER - Main App Logic
// ============================================================

/**
 * Application Controller - Orchestrates all components
 */
class ApplicationController {
  constructor() {
    // Initialize storage
    this.storage = new StorageManager();

    // Initialize state
    this.appState = new AppState();
    this.loadState();

    // Initialize presenters
    this.authPresenter = new AuthPresenter(this.storage, this.appState);
    this.generatorPresenter = new GeneratorPresenter();
    this.historyPresenter = new HistoryPresenter(this.appState, this.storage);
    this.settingsPresenter = new SettingsPresenter(this.appState, this.storage);

    // Initialize views
    this.authView = new AuthView();
    this.generatorView = new GeneratorView();
    this.historyView = new HistoryView();
    this.settingsView = new SettingsView();

    // Initialize UI
    this.setupEventListeners();
  }

  /**
   * Load state from storage
   */
  loadState() {
    const currentUser = this.storage.getCurrentUser();
    if (currentUser) {
      this.appState.setCurrentUser(currentUser);
    }

    const history = this.storage.getHistory();
    this.appState.groupHistory = history;

    const theme = this.storage.getTheme();
    this.appState.theme = theme;

    const preferences = this.storage.getPreferences();
    this.appState.preferences = {
      ...this.appState.preferences,
      ...preferences,
    };

    // Load persisted statistics
    const statistics = this.storage.getStatistics();
    if (statistics) {
      this.appState.setCurrentStatistics(statistics);
    }

    // Load persisted performance metrics
    const performanceMetrics = this.storage.getPerformanceMetrics();
    if (performanceMetrics) {
      this.appState.performanceMetrics = performanceMetrics;
    }
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Set copyright year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Update UI based on login state
    this.updateUIForLoginState();

    // Auth modal controls
    const modalClose = document.getElementById("modal-close");
    const modalCancel = document.getElementById("modal-cancel");
    const modalBackdrop = document.getElementById("modal-backdrop");

    if (modalClose)
      modalClose.addEventListener("click", () => this.authView.hideLoginForm());
    if (modalCancel)
      modalCancel.addEventListener("click", () =>
        this.authView.hideLoginForm()
      );
    if (modalBackdrop)
      modalBackdrop.addEventListener("click", () =>
        this.authView.hideLoginForm()
      );

    const modalCloseSignup = document.getElementById("modal-close-signup");
    const modalCancelSignup = document.getElementById("modal-cancel-signup");
    const modalBackdropSignup = document.getElementById(
      "modal-backdrop-signup"
    );

    if (modalCloseSignup)
      modalCloseSignup.addEventListener("click", () =>
        this.authView.hideSignupForm()
      );
    if (modalCancelSignup)
      modalCancelSignup.addEventListener("click", () =>
        this.authView.hideSignupForm()
      );
    if (modalBackdropSignup)
      modalBackdropSignup.addEventListener("click", () =>
        this.authView.hideSignupForm()
      );

    // Login/Signup form submissions
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSignup();
      });
    }

    // Auth links
    const switchToSignupLink = document.getElementById("switch-to-signup");
    if (switchToSignupLink) {
      switchToSignupLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.authView.hideLoginForm();
        this.authView.showSignupForm();
      });
    }

    const switchToLoginLink = document.getElementById("switch-to-login");
    if (switchToLoginLink) {
      switchToLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.authView.hideSignupForm();
        this.authView.showLoginForm();
      });
    }

    // Nav login button
    const navLoginBtn = document.getElementById("nav-login");
    if (navLoginBtn) {
      navLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!this.appState.isLoggedIn()) {
          this.authView.showLoginForm();
        }
      });
    }

    // Generate button (dashboard)
    const genBtn = document.getElementById("generate-btn");
    if (genBtn) {
      genBtn.addEventListener("click", () => this.handleGenerate());
    }

    // Export CSV button
    const exportCsvBtn = document.getElementById("export-csv-btn");
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", () => this.handleExportCSV());
    }

    // Tab buttons (dashboard)
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        if (tab && tab !== "logout") {
          this.switchTab(tab);
        }
      });
    });

    // Logout button (dashboard)
    const navLogoutBtn = document.getElementById("nav-logout-btn");
    if (navLogoutBtn) {
      navLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Initialize theme
    this.initializeTheme();

    // CSV import
    const csvInput = document.getElementById("csv-import");
    if (csvInput) {
      csvInput.addEventListener("change", (e) => this.handleCSVImport(e));
    }
  }

  /**
   * Handle login
   */
  handleLogin() {
    const creds = this.authView.getLoginCredentials();
    const result = this.authPresenter.login(creds.email, creds.password);

    if (result.success) {
      // Save to storage immediately before redirect
      this.storage.saveCurrentUser(result.user);
      this.authView.showMessage("login", result.message, "success");
      setTimeout(() => {
        this.authView.hideLoginForm();
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      this.authView.showMessage("login", result.message, "error");
    }
  }

  /**
   * Handle signup
   */
  handleSignup() {
    const data = this.authView.getSignupData();
    const result = this.authPresenter.signup(
      data.name,
      data.email,
      data.password,
      data.confirmPassword
    );

    if (result.success) {
      // Save to storage immediately before redirect
      if (result.user) {
        this.storage.saveCurrentUser(result.user);
      }
      this.authView.showMessage("signup", result.message, "success");
      // Use a slightly longer timeout to ensure data is written
      setTimeout(() => {
        this.authView.hideSignupForm();
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      this.authView.showMessage("signup", result.message, "error");
    }
  }

  /**
   * Handle group generation
   */
  handleGenerate() {
    const studentInput = this.generatorView.getStudentInput();
    const config = this.generatorView.getGroupConfig();

    const result = this.generatorPresenter.generateGroups(
      studentInput,
      config.numGroups,
      config.perGroup
    );

    if (!result.success) {
      this.generatorView.showAlert(result.error, "error");
      return;
    }

    this.generatorView.renderGroups(result.groups);
    this.generatorView.showAlert(result.message, "success");
    this.generatorView.showExportButton(true);

    // Calculate and display statistics
    const names = studentInput
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const statistics = this.generatorPresenter.calculateStatistics(
      result.groups,
      names
    );
    this.generatorView.showStatisticsPanel(statistics);

    // Save statistics to storage
    this.appState.setCurrentStatistics(statistics);
    this.storage.saveStatistics(statistics);

    // Check for duplicate pairings
    const history = this.appState.getHistory();
    if (history.length > 0) {
      const duplicateReport = this.generatorPresenter.generateDuplicateReport(
        result.groups,
        history
      );
      this.generatorView.showDuplicateReport(duplicateReport);
    }

    // Save to history if auto-save enabled
    if (this.appState.preferences.autoSave) {
      const gen = this.historyPresenter.addGeneration(
        names,
        result.groups,
        config.numGroups,
        config.perGroup
      );
    }

    // Store current groups for export
    this.appState.setCurrentGroups(result.groups);

    // Add performance metrics
    this.appState.addPerformanceMetric({
      timestamp: new Date().toISOString(),
      balanceScore: statistics.balanceScore,
      diversityScore: statistics.diversityScore,
      totalGroups: result.groups.length,
      totalStudents: names.length,
    });

    // Save performance metrics to storage
    this.storage.savePerformanceMetrics(this.appState.getPerformanceMetrics());

    // Render charts
    this.generatorView.renderGroupSizeChart(result.groups);
    this.generatorView.renderPerformanceTrend(
      this.appState.getPerformanceMetrics()
    );

    // Add copy to clipboard button
    this.addCopyButton(result.groups, names);
  }

  /**
   * Add copy to clipboard button
   */
  addCopyButton(groups, names) {
    const exportSection = document.getElementById("export-section");
    if (!exportSection) return;

    // Remove existing copy button if any
    const existingCopyBtn = exportSection.querySelector(".copy-btn");
    if (existingCopyBtn) {
      existingCopyBtn.remove();
    }

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn btn-primary copy-btn";
    copyBtn.innerHTML = "📋 Copy to Clipboard";
    copyBtn.style.marginRight = "10px";

    copyBtn.addEventListener("click", async () => {
      const formattedText = this.generatorPresenter.formatGroupsAsText(groups);
      const success = await this.generatorView.copyToClipboard(formattedText);

      if (success) {
        this.generatorView.showAlert("✓ Copied to clipboard!", "success");
        copyBtn.innerHTML = "✓ Copied!";
        setTimeout(() => {
          copyBtn.innerHTML = "📋 Copy to Clipboard";
        }, 2000);
      } else {
        this.generatorView.showAlert("Failed to copy", "error");
      }
    });

    exportSection.insertBefore(copyBtn, exportSection.firstChild);
  }

  /**
   * Handle CSV export
   */
  handleExportCSV() {
    const groups = this.appState.getCurrentGroups();
    if (!groups) {
      this.generatorView.showAlert(
        "No groups to export. Generate groups first.",
        "error"
      );
      return;
    }

    const csv = this.generatorPresenter.exportAsCSV(groups);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `groups_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.generatorView.showAlert(
      "✓ Groups exported successfully as CSV!",
      "success"
    );
  }

  /**
   * Handle CSV import
   */
  handleCSVImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const names = this.generatorPresenter.parseCSV(csv);

        if (names.length === 0) {
          this.generatorView.showAlert(
            "No valid names found in CSV file.",
            "error"
          );
          return;
        }

        this.generatorView.setStudentInput(names.join("\n"));
        this.generatorView.showAlert(
          `✓ Successfully imported ${names.length} students from CSV!`,
          "success"
        );
        e.target.value = "";
      } catch (err) {
        this.generatorView.showAlert(
          `Error parsing CSV file: ${err.message}`,
          "error"
        );
        e.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  /**
   * Update UI based on login state
   */
  updateUIForLoginState() {
    const isLogged = this.appState.isLoggedIn();
    this.authView.updateNavigation(isLogged);
    this.authView.updateCTAButtons(isLogged);
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const body = document.getElementById("app-body");
    if (!body) return;

    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    const theme = isDark ? "dark" : "light";

    // Update both theme and preferences to keep them in sync
    this.settingsPresenter.setTheme(theme);
    this.settingsPresenter.updatePreference("darkMode", isDark);
    this.updateThemeIcon();
  }

  /**
   * Initialize theme
   */
  initializeTheme() {
    const theme = this.appState.theme;
    const body = document.getElementById("app-body");

    if (theme === "dark" && body) {
      body.classList.add("dark-mode");
    }

    this.updateThemeIcon();
  }

  /**
   * Update theme icon
   */
  updateThemeIcon() {
    const body = document.getElementById("app-body");
    const icon = document.getElementById("theme-icon");
    if (icon) {
      icon.textContent = body?.classList.contains("dark-mode") ? "☀️" : "🌙";
    }
  }

  /**
   * Load generation from history
   */
  loadFromHistory(id) {
    const entry = this.historyPresenter.loadGeneration(id);
    if (!entry || !entry.groups) return;

    this.switchTab("generator");
    const studentInput = entry.groups.map((g) => g.join("\n")).join("\n");
    this.generatorView.setStudentInput(studentInput);
    this.generatorView.renderGroups(entry.groups);
    this.appState.setCurrentGroups(entry.groups);
    this.generatorView.showExportButton(true);
  }

  /**
   * Delete from history
   */
  deleteFromHistory(id) {
    if (confirm("Delete this generation from history?")) {
      this.historyPresenter.deleteGeneration(id);
      this.renderHistory();
    }
  }

  /**
   * Switch tab with accessibility enhancements
   */
  switchTab(tabName) {
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-hidden", "true");
    });

    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      selectedTab.classList.add("active");
      selectedTab.setAttribute("aria-hidden", "false");
    }

    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add("active");
      selectedBtn.setAttribute("aria-selected", "true");
    }

    if (tabName === "history") {
      this.renderHistory();
    } else if (tabName === "settings") {
      this.initializeSettings();
    }
  }

  /**
   * Render history
   */
  renderHistory() {
    const history = this.historyPresenter.getHistory();
    this.historyView.renderHistory(history);
  }

  /**
   * Initialize settings
   */
  initializeSettings() {
    const user = this.appState.getCurrentUser();
    this.settingsView.renderUserInfo(user);
    this.settingsView.renderPreferences(this.appState.preferences);

    const darkModeCheckbox = this.settingsView.getDarkModeCheckbox();
    if (darkModeCheckbox) {
      darkModeCheckbox.removeEventListener("change", this.onDarkModeChange);
      darkModeCheckbox.addEventListener("change", (e) => {
        const isDarkMode = e.target.checked;
        // Update preferences
        this.settingsPresenter.updatePreference("darkMode", isDarkMode);
        // Update theme to match
        const theme = isDarkMode ? "dark" : "light";
        this.settingsPresenter.setTheme(theme);
        // Update UI
        const body = document.getElementById("app-body");
        if (body) {
          if (isDarkMode) {
            body.classList.add("dark-mode");
          } else {
            body.classList.remove("dark-mode");
          }
        }
        this.updateThemeIcon();
      });
    }

    const autoSaveCheckbox = this.settingsView.getAutoSaveCheckbox();
    if (autoSaveCheckbox) {
      autoSaveCheckbox.removeEventListener("change", this.onAutoSaveChange);
      autoSaveCheckbox.addEventListener("change", (e) => {
        this.settingsPresenter.updatePreference("autoSave", e.target.checked);
      });
    }

    const clearHistoryBtn = document.getElementById("clear-history-btn");
    if (clearHistoryBtn) {
      clearHistoryBtn.removeEventListener("click", this.onClearHistory);
      clearHistoryBtn.addEventListener("click", () => {
        if (
          confirm("Are you sure? This will delete all saved group generations.")
        ) {
          this.historyPresenter.clearHistory();
          this.renderHistory();
          this.settingsView.showMessage(
            "History cleared successfully.",
            "success"
          );
        }
      });
    }
  }

  /**
   * Logout
   */
  logout() {
    this.authPresenter.logout();
    this.storage.saveCurrentUser(null);
    window.location.href = "index.html";
  }

  /**
   * Initialize dashboard
   */
  initializeDashboard() {
    if (!this.appState.isLoggedIn()) {
      window.location.href = "index.html";
      return;
    }

    const user = this.appState.getCurrentUser();
    const nameDisplay = document.getElementById("user-name-display");
    const joinedDisplay = document.getElementById("user-joined-display");

    if (nameDisplay && user) {
      nameDisplay.textContent = user.name || "User";
    }

    if (joinedDisplay) {
      const joinDate = user.joinDate
        ? new Date(user.joinDate).toLocaleDateString()
        : new Date().toLocaleDateString();
      joinedDisplay.textContent = `Joined: ${joinDate}`;
    }

    this.switchTab("generator");
  }
}

// ============================================================
// INITIALIZATION
// ============================================================

let eApp; // Global app instance

// Debounce helper for performance optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Request animation frame helper for smooth animations
const rafThrottle = (func) => {
  let rafId = null;
  return function throttled(...args) {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Initialize the application
    window.eApp = eApp = new ApplicationController();

    // Check if on dashboard
    if (document.getElementById("dashboard-root")) {
      eApp.initializeDashboard();
    }

    // Add animation styles if not present
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
  },
  { once: false }
);

// ============================================================
// GLOBAL EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================

// Cached references for performance
window.logout = () => eApp?.logout();
window.isLoggedIn = () => eApp?.appState.isLoggedIn();
Object.defineProperty(window, "currentUser", {
  get() {
    return eApp?.appState.getCurrentUser();
  },
  enumerable: true,
  configurable: true,
});
window.switchToSignup = () => eApp?.authView.showSignupForm();
window.switchToLogin = () => eApp?.authView.showLoginForm();
window.switchTab = (tab) => eApp?.switchTab(tab);
window.handleHeroCTA = () => {
  if (eApp?.appState.isLoggedIn()) {
    window.location.href = "dashboard.html";
  } else {
    eApp?.authView.showSignupForm();
  }
};
window.handleCTAButton = () => {
  if (eApp?.appState.isLoggedIn()) {
    window.location.href = "dashboard.html";
  } else {
    eApp?.authView.showSignupForm();
  }
};
