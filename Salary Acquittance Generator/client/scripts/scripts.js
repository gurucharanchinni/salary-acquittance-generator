const adminForm = document.getElementById("adminLoginForm");
let staffData = [];
const accountsForm = document.getElementById("accountsLoginForm");
const manageForm = document.getElementById("manageLoginForm");
const currentSalaryData = [
  {
    id: 0,
    name: "Sudhamshu",
    basicPay: 75000,
    da: 3000,
    hra: 5000,
    allowances: 2000,
    grossSalary: 85000,
    pf: 12000,
    esi: 500,
    ptit: 300,
    totalDeductions: 13000,
    netSalary: 72000,
  },
  {
    id: 2,
    name: "Himesh",
    basicPay: 50000,
    da: 3000,
    hra: 5000,
    allowances: 2000,
    grossSalary: 60000,
    pf: 12000,
    esi: 500,
    ptit: 300,
    totalDeductions: 13000,
    netSalary: 47000,
  },
  {
    id: 3,
    name: "Abhishek",
    basicPay: 50000,
    da: 3000,
    hra: 5000,
    allowances: 2000,
    grossSalary: 60000,
    pf: 12000,
    esi: 500,
    ptit: 300,
    totalDeductions: 13000,
    netSalary: 47000,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  initializeLogin();
});

const pathName = window.location.pathname;
if (pathName.includes("admindashboard.html")) {
  // getAllStaff() as soon as admin dashboard is loaded
  window.onload = () => renderStaffTable();
}

async function getAllStaff() {
  try {
    const response = await fetch("http://localhost:8080/staff", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Fallback mock data if API returns empty
    if (data.length === 0) {
      return [
        {
          id: 1,
          name: "John Doe",
          designation: "Manager",
          department: "HR",
          joiningDate: "2022-01-01",
          basicPay: 50000,
          status: "Active",
        },
        {
          id: 2,
          name: "Jane Smith",
          designation: "Developer",
          department: "IT",
          joiningDate: "2022-02-01",
          basicPay: 60000,
          status: "Active",
        },
      ];
    }

    return data;
  } catch (error) {
    console.error("Error fetching staff data:", error);
    return [];
  }
}

function initializeLogin() {
  if (adminForm) {
    adminForm.addEventListener("submit", (e) => handleLogin(e, "admin"));
  }
  if (accountsForm) {
    accountsForm.addEventListener("submit", (e) => handleLogin(e, "accounts"));
  }
  if (manageForm) {
    manageForm.addEventListener("submit", (e) => handleLogin(e, "manage"));
  }
  renderStaffTable();
}

function handleLogin(e, tabName) {
  e.preventDefault();
  const username = document.getElementsByClassName("username");
  const password = document.getElementsByClassName("password");

  if (tabName === "admin") {
    const response = fetch("http://localhost:8080/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username[0].value,
        password: password[0].value,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "Admin Login successful") {
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "admindashboard.html";
        }
        if (data === "Manage Login successful") {
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "managedashboard.html";
        }
        console.log(data);
        // alert("Invalid credentials. Please use: admin / admin123");
      });

    if (!response.ok) {
      console.log(response);
    }
  }
  if (tabName === "accounts") {
    const response = fetch("http://localhost:8080/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username[1].value,
        password: password[1].value,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "Accounts Login successful") {
          console.log(data);
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "accountsdashboard.html";
        }
      });
  }
  if (tabName === "manage") {
    const response = fetch("http://localhost:8080/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username[2].value,
        password: password[2].value,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "Manage Login successful") {
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "managedashboard.html";
        } else {
          alert("Invalid credentials. Please use: admin / admin123");
        }
      });
  }
}

async function renderStaffTable() {
  const tbody = document.getElementById("staffTableBody");
  if (tbody == null) return;
  tbody.innerHTML = "";
  const staffData = getAllStaff();
  console.log(staffData);
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function openAddStaffModal() {
  document.getElementById("addStaffModal").classList.remove("hidden");
  document.getElementById("addStaffModal").classList.add("modal-enter");
}

function closeAddStaffModal() {
  document.getElementById("addStaffModal").classList.add("hidden");
  document.getElementById("addStaffForm").reset();
}

function handleAddStaff(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const staff = {};
  formData.forEach((value, key) => (staff[key] = value));
  staff.status = "Active";
  const response = fetch("http://localhost:8080/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  })
    .then((response) => response.json())
    .then((data) => {
      staffData.push(data);
      localStorage.setItem("staffData", JSON.stringify(staffData));
      renderStaffTable();
      closeAddStaffModal();
    });
}

function changeStaffStatus(staffId) {
  const staff = staffData.find((staff) => staff.id === staffId);
  staff.status = staff.status === "Active" ? "Relieved" : "Active";
  localStorage.setItem("staffData", JSON.stringify(staffData));
  renderStaffTable();
}

function setupFormHandlers() {
  const addStaffForm = document.getElementById("addStaffForm");
  addStaffForm.addEventListener("submit", handleAddStaff);
}

async function handleSalaryCalculation(event) {
  event.preventDefault();

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  if (!startDateInput || !endDateInput) {
    console.error("Date input elements not found");
    return;
  }

  const month = startDateInput.value;
  const year = endDateInput.value;

  if (!month || !year) {
    alert("Please select both start and end dates.");
    return;
  }

  console.log(month, year);

  let staffData;
  try {
    staffData = getAllStaff();
    if (!Array.isArray(staffData)) {
      throw new Error("Invalid staff data");
    }
  } catch (error) {
    console.error("Failed to retrieve staff data:", error);
    alert("Error retrieving staff data. Please try again later.");
    return;
  }

  const activeStaff = staffData.filter((staff) => staff.status === "ACTIVE");

  if (activeStaff.length === 0) {
    alert("No active staff found!");
    return;
  }

  currentSalaryData = activeStaff.map((staff) => {
    const basicPay = staff.basicPay || 0;
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
      id: staff.id || "N/A",
      name: staff.name || "N/A",
      designation: staff.designation || "N/A",
      basicPay: staff.basicPay || 0,
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

  currentPeriod = `${month} ${year}`;
  renderSalaryTable();
}

function renderSalaryTable() {
  const tbody = document.getElementById("salaryTableBody");
  tbody.innerHTML = "";

  document.getElementById("salaryResults").classList.remove("hidden");
  document.getElementById("calculatorTab").classList.remove("hidden");

  currentSalaryData.forEach((staff) => {
    console.log(staff);
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

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
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

document.getElementById("calculatorTab").classList.remove("hidden");
document.getElementById("salaryResults").classList.remove("hidden");
