// Global variables
let staffData = [];
let currentSalaryData = [];
let currentPeriod = "";

const adminForm = document.getElementById("adminLoginForm");
const accountsForm = document.getElementById("accountsLoginForm");
const manageForm = document.getElementById("manageLoginForm");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("dashboard.html")) {
    initializeDashboard();
  } else {
    initializeLogin();
  }
});

// Login functionality
function initializeLogin(tabName) {
  // const loginForm = document.getElementById("loginForm");
  // if (loginForm) {
  //   loginForm.addEventListener("submit", handleLogin);
  // }

  const adminForm = document.getElementById("adminLoginForm");
  const accountsForm = document.getElementById("accountsLoginForm");
  const manageForm = document.getElementById("manageLoginForm");

  if (tabName === "admin") {
    adminForm.addEventListener("submit", (e) => handleLogin(e, "admin"));
  }
  if (tabName === "accounts") {
    accountsForm.addEventListener("submit", (e) => handleLogin(e, "accounts"));
  }
  if (tabName === "manage") {
    manageForm.addEventListener("submit", (e) => handleLogin(e, "manage"));
  }
}

function handleLogin(e, tabName) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (tabName === "admin") {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "admindashboard.html";
    }
  }
  if (tabName === "accounts") {
    if (username === "accounts" && password === "accounts123") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "accountsdashboard.html";
    }
  }
  if (tabName === "manage") {
    if (username === "manage" && password === "manage123") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "managedashboard.html";
    }
  }
  // Simple dummy authentication
  // if (username === "admin" && password === "admin123" && role === "Admin") {
  //   localStorage.setItem("userRole", role);
  //   localStorage.setItem("isLoggedIn", "true");
  //   window.location.href = "dashboard.html";
  // } else {
  //   alert("Invalid credentials. Please use: admin / admin123");
  // }
}

// Dashboard functionality
function initializeDashboard() {
  // Check if user is logged in
  if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "index.html";
    return;
  }

  // Set user role
  const userRole = localStorage.getItem("userRole") || "Admin" || "Accounts" || "Management";
  document.getElementById("userRole").textContent = userRole;

  // Initialize data
  loadSampleData();
  populateYearDropdown();
  renderStaffTable();

  // Set up form handlers
  setupFormHandlers();
}

function loadSampleData() {
  // Load sample staff data if not exists
  const savedData = localStorage.getItem("staffData");
  if (savedData) {
    staffData = JSON.parse(savedData);
  } else {
    staffData = [
      {
        id: "EMP001",
        name: "Dr. John Smith",
        designation: "Professor",
        department: "Computer Science",
        joiningDate: "2020-01-15",
        basicPay: 75000,
        status: "Active",
      },
      {
        id: "EMP002",
        name: "Ms. Sarah Johnson",
        designation: "Assistant Professor",
        department: "Mathematics",
        joiningDate: "2021-03-10",
        basicPay: 55000,
        status: "Active",
      },
      {
        id: "EMP003",
        name: "Mr. David Wilson",
        designation: "Lecturer",
        department: "Physics",
        joiningDate: "2019-08-20",
        basicPay: 45000,
        status: "Relieved",
      },
    ];
    saveStaffData();
  }
}

function saveStaffData() {
  localStorage.setItem("staffData", JSON.stringify(staffData));
}

function populateYearDropdown() {
  const yearSelect = document.getElementById("salaryYear");
  const currentYear = new Date().getFullYear();

  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    if (year === currentYear) {
      option.selected = true;
    }
    yearSelect.appendChild(option);
  }
}

function setupFormHandlers() {
  // Add staff form
  const addStaffForm = document.getElementById("addStaffForm");
  if (addStaffForm) {
    addStaffForm.addEventListener("submit", handleAddStaff);
  }

  // Salary calculator form
  const salaryForm = document.getElementById("salaryCalculatorForm");
  if (salaryForm) {
    salaryForm.addEventListener("submit", handleSalaryCalculation);
  }
}

// Tab functionality
function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => tab.classList.add("hidden"));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach((button) => {
    button.classList.remove("active");
    button.classList.remove("border-blue-500", "text-blue-600");
    button.classList.add("border-transparent", "text-gray-500");
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName + "Tab");
  if (selectedTab) {
    selectedTab.classList.remove("hidden");
  }

  // Activate selected button
  const selectedButton = event.target;
  selectedButton.classList.add("active");
  selectedButton.classList.remove("border-transparent", "text-gray-500");
  selectedButton.classList.add("border-blue-500", "text-blue-600");
}

// Staff management functions
function renderStaffTable() {
  const tbody = document.getElementById("staffTableBody");
  tbody.innerHTML = "";

  staffData.forEach((staff) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.id
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.name
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.designation
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.department
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(
              staff.joiningDate
            )}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.basicPay.toLocaleString()}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-${staff.status.toLowerCase()}">${
      staff.status
    }</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                ${
                  staff.status === "Active"
                    ? `<button onclick="changeStaffStatus('${staff.id}')" class="text-red-600 hover:text-red-900">Mark Relieved</button>`
                    : `<button onclick="changeStaffStatus('${staff.id}')" class="text-green-600 hover:text-green-900">Mark Active</button>`
                }
            </td>
        `;
    tbody.appendChild(row);
  });
}

function openAddStaffModal() {
  document.getElementById("addStaffModal").classList.remove("hidden");
  document.getElementById("addStaffModal").classList.add("modal-enter");
}

function closeAddStaffModal() {
  document.getElementById("addStaffModal").classList.add("hidden");
  document.getElementById("addStaffForm").reset();
}

function handleAddStaff(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newStaff = {
    id: formData.get("staffId"),
    name: formData.get("staffName"),
    designation: formData.get("designation"),
    department: formData.get("department"),
    joiningDate: formData.get("joiningDate"),
    basicPay: parseInt(formData.get("basicPay")),
    status: formData.get("status"),
  };

  // Check if staff ID already exists
  if (staffData.find((staff) => staff.id === newStaff.id)) {
    alert("Staff ID already exists!");
    return;
  }

  staffData.push(newStaff);
  saveStaffData();
  renderStaffTable();
  closeAddStaffModal();

  // Mock API call

  mockApiCall("POST", "/api/staff", newStaff);
}

function changeStaffStatus(staffId) {
  const staff = staffData.find((s) => s.id === staffId);
  if (staff) {
    staff.status = staff.status === "Active" ? "Relieved" : "Active";
    saveStaffData();
    renderStaffTable();

    // Mock API call
    mockApiCall("PUT", `/api/staff/${staffId}/status`, {
      status: staff.status,
    });
  }
}

// Salary calculation functions
function handleSalaryCalculation(e) {
  e.preventDefault();

  const month = document.getElementById("salaryMonth").value;
  const year = document.getElementById("salaryYear").value;

  // Get active staff only
  const activeStaff = staffData.filter((staff) => staff.status === "Active");

  if (activeStaff.length === 0) {
    alert("No active staff found!");
    return;
  }

  currentSalaryData = activeStaff.map((staff) => {
    const basicPay = staff.basicPay;
    const da = Math.round(basicPay * 0.1);
    const hra = Math.round(basicPay * 0.15);
    const allowances = 2000;
    const grossSalary = basicPay + da + hra + allowances;

    const pf = Math.round(basicPay * 0.12);
    const esi = 500;
    const ptit = 300;
    const totalDeductions = pf + esi + ptit;

    const netSalary = grossSalary - totalDeductions;

    return {
      ...staff,
      basicPay,
      da,
      hra,
      allowances,
      grossSalary,
      pf,
      esi,
      ptit,
      totalDeductions,
      netSalary,
    };
  });

  currentPeriod = `${getMonthName(month)} ${year}`;
  renderSalaryTable();
  renderReportTable();

  document.getElementById("salaryResults").classList.remove("hidden");

  // Mock API call
  mockApiCall("POST", "/api/salary/calculate", {
    month,
    year,
    staff: activeStaff,
  });
}

function renderSalaryTable() {
  const tbody = document.getElementById("salaryTableBody");
  tbody.innerHTML = "";

  currentSalaryData.forEach((staff) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.id
            }</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.name
            }</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.basicPay.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.da.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.hra.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.allowances.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹${staff.grossSalary.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.pf.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.esi.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₹${staff.ptit.toLocaleString()}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-green-600">₹${staff.netSalary.toLocaleString()}</td>
        `;
    tbody.appendChild(row);
  });
}

function renderReportTable() {
  const reportTable = document.getElementById("reportTable");
  const reportPeriod = document.getElementById("reportPeriod");

  reportPeriod.textContent = `Salary Report for ${currentPeriod}`;

  if (currentSalaryData.length === 0) {
    reportTable.innerHTML =
      '<p class="text-gray-500 text-center">No salary data available. Please calculate salary first.</p>';
    return;
  }

  reportTable.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200" id="reportTableData">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">DA</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">HRA</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">PF</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ESI</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">PT/IT</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signature</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${currentSalaryData
                  .map(
                    (staff) => `
                    <tr>
                        <td class="px-3 py-4 text-sm text-gray-900">${
                          staff.id
                        }</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${
                          staff.name
                        }</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${
                          staff.designation
                        }</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.basicPay.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.da.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.hra.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.allowances.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900 font-semibold">₹${staff.grossSalary.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.pf.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.esi.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.ptit.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">₹${staff.totalDeductions.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900 font-bold text-green-600">₹${staff.netSalary.toLocaleString()}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">
                            <div class="signature-column border border-gray-300 h-10"></div>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

// Print and PDF functions
function printReport() {
  if (currentSalaryData.length === 0) {
    alert("Please calculate salary first!");
    return;
  }

  window.print();
}

function downloadPDF() {
  if (currentSalaryData.length === 0) {
    alert("Please calculate salary first!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4"); // landscape orientation

  // Add title
  doc.setFontSize(16);
  doc.text("Salary Acquittance Report", 20, 20);
  doc.setFontSize(12);
  doc.text(`Period: ${currentPeriod}`, 20, 30);

  // Prepare table data
  const headers = [
    "Emp ID",
    "Name",
    "Designation",
    "Basic",
    "DA",
    "HRA",
    "Allowances",
    "Gross",
    "PF",
    "ESI",
    "PT/IT",
    "Deductions",
    "Net Salary",
  ];

  const data = currentSalaryData.map((staff) => [
    staff.id,
    staff.name,
    staff.designation,
    `₹${staff.basicPay.toLocaleString()}`,
    `₹${staff.da.toLocaleString()}`,
    `₹${staff.hra.toLocaleString()}`,
    `₹${staff.allowances.toLocaleString()}`,
    `₹${staff.grossSalary.toLocaleString()}`,
    `₹${staff.pf.toLocaleString()}`,
    `₹${staff.esi.toLocaleString()}`,
    `₹${staff.ptit.toLocaleString()}`,
    `₹${staff.totalDeductions.toLocaleString()}`,
    `₹${staff.netSalary.toLocaleString()}`,
  ]);

  // Add table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [71, 85, 105] },
  });

  // Save the PDF
  doc.save(`salary-report-${currentPeriod.replace(" ", "-")}.pdf`);
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN");
}

function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[parseInt(monthNumber) - 1];
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
}

// Mock API functions
function mockApiCall(method, endpoint, data = null) {
  console.log(`Mock API Call: ${method} ${endpoint}`, data);

  // Simulate API delay

  setTimeout(() => {
    console.log(`Mock API Response: ${method} ${endpoint} - Success`);
  }, 500);
}

// Close modal when clicking outside
document.addEventListener("click", function (e) {
  const modal = document.getElementById("addStaffModal");
  if (e.target === modal) {
    closeAddStaffModal();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeAddStaffModal();
  }
});
