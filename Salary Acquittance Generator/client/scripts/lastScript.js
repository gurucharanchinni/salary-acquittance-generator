console.log("Start of the script");

const registerForm = document.getElementById("registerForm");
if (registerForm)
  registerForm.addEventListener("submit", (e) => handleRegister(e));

document.addEventListener("click", (e) => {
  console.log("Document saw click on:", e.target);
});

document.addEventListener("DOMContentLoaded", function (e) {
  initializeLogin();
  const profileLink = document.getElementById("profileLink");

  if (profileLink)
    profileLink.addEventListener("click", (e) => handleProfile(e));

  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  if (forgotPasswordBtn)
    forgotPasswordBtn.addEventListener("click", (e) => handleForgotPassword(e));
  const pathName = window.location.pathname.toLowerCase();

  profileEdit();

  if (pathName.includes("prof.html")) {
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    changePasswordBtn.addEventListener("click", (e) => handlePassword(e));

    handleProfilePage();
  }

  const toggle = document.getElementById("profileToggle");
  const menu = document.getElementById("profileMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const chevron = toggle.querySelector("svg"); // get chevron inside button

  if (!toggle || !menu || !logoutBtn || !chevron) return;

  let open = false;

  function openMenu() {
    open = true;
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.remove("hidden");
    chevron.style.transform = "rotate(180deg)";
    chevron.style.transition = "transform 0.2s ease";
  }

  function closeMenu() {
    open = false;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.add("hidden");
    chevron.style.transform = "rotate(0deg)";
    chevron.style.transition = "transform 0.2s ease";
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    open ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && open) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) closeMenu();
  });

  logoutBtn.addEventListener("click", () => {
    handleLogout();
  });
});

async function handleLogout() {
  const response = await fetch("http://localhost:8080/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  let data = await response.text();
  if (data === "logout") {
    window.location.href = "../index.html";
  } else {
    alert("Logout failed");
  }
}

async function handleForgotPassword() {
  const loginRegisterCard = document.getElementById("loginRegisterCard");
  loginRegisterCard.classList.add("hidden");
  const forgotPasswordCard = document.getElementById("forgotPasswordTab");
  forgotPasswordCard.classList.remove("hidden");
  const resetPassword = document.getElementById("ResetPassword");

  resetPassword.addEventListener("click", (e) => handleResetPassword(e));
}

async function handleResetPassword(e) {
  e.preventDefault();
  const forgotUsername = document.getElementById("forgotUsername");
  const forgotPassword = document.getElementById("forgotPassword");
  const confirmPassword = document.getElementById("confirmPassword1");

  if (forgotPassword.value !== confirmPassword.value) {
    return;
  }

  const response = await fetch("http://localhost:8080/forgotpassword", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: forgotUsername.value,
      password: forgotPassword.value,
    }),
  });

  let data = await response.text();
  if (!data) {
    return;
  }
  if (data === "Password Change Success") {
    alert("Password Reset Success");
    const loginRegisterCard = document.getElementById("loginRegisterCard");
    loginRegisterCard.classList.remove("hidden");
    const forgotPasswordCard = document.getElementById("forgotPasswordTab");
    forgotPasswordCard.classList.add("hidden");
  } else {
    alert("Password Reset Failed");
  }
}

function initializeLogin(e) {
  localStorage.clear();
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => handleLogin(e));
  }
}

async function handlePassword(e) {
  let username = profileEdit();
  const changeForm = document.getElementById("changePasswordForm");
  const cancelpassword = document.getElementById("cancelPasswordBtn");
  changeForm.classList.remove("hidden");
  cancelpassword.addEventListener("click", (e) => handleCancel(e));
  changeForm.addEventListener("submit", (e) =>
    handleChangePassword(e, username)
  );
}

function handleCancel(e) {
  e.preventDefault();
  const changeForm = document.getElementById("changePasswordForm");
  changeForm.classList.add("hidden");
}
async function handleChangePassword(e, username) {
  e.preventDefault();
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }
  let value = password.value;
  const response = await fetch(
    "http://localhost:8080/profile/change-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: value,
      }),
    }
  )
    .then((response) => response.text())
    .then((data) => {
      if (data === "Password Change Success") {
        alert("Password was changed Successfully");
      }
    });
}

async function handleRegister(e) {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const userInput = document.getElementById("registerUsername");
  const passInput = document.getElementById("registerPassword");
  const confirmPass = document.getElementById("confirmPassword");
  const roleInput = document.getElementById("dropdownSelect");
  const emailInput = document.getElementById("email");
  let username = userInput.value;
  let password = passInput.value;
  let name = nameInput.value;
  let confirm = confirmPass.value;
  let role = roleInput.value;
  let email = emailInput.value;

  localStorage.setItem("username", username);
  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }
  const formData = new FormData();
  formData.append("email", email);
  const emailResponse = await fetch("http://localhost:8080/admin/checkemail", {
    method: "POST",
    body: formData,
  });

  if (!emailResponse.ok) {
    return;
  }

  let data = await emailResponse.text();
  if (!data) return;
  if ((data === "Found" && role === "FACULTY") || role !== "FACULTY") {
    const response = await fetch("http://localhost:8080/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        email: email,
        password: password,
        role: role,
      }),
    });

    nameInput.value = "";
    userInput.value = "";
    passInput.value = "";
    confirmPass.value = "";
    emailInput.value = "";
    roleInput.selectedIndex = 0;
    let data1 = await response.text();
    if (data1 === "User Creation Success") {
      showTab("login");
    } else if (data1 === "User Already Exists") {
      alert("User Already Exists");
    }
  } else if (data === "Not Found" && role === "FACULTY") {
    nameInput.value = "";
    userInput.value = "";
    passInput.value = "";
    confirmPass.value = "";
    emailInput.value = "";
    roleInput.selectedIndex = 0;
    alert("Please Consult with your hr to give you appropriate credentials.");
  }
}

async function handleProfile(e) {
  e.preventDefault();
  let username = profileEdit();
  console.log(username);

  window.location.href = `prof.html?username=${encodeURIComponent(username)}`;
  handleProfilePage();
}

async function handleProfilePage() {
  let username = profileEdit();

  const name = document.getElementById("name");
  const usernameDiv = document.getElementById("username");
  const role = document.getElementById("role");

  const response = await fetch("http://localhost:8080/profile/", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: username,
  })
    .then((response) => response.json())
    .then((data) => {
      const logs = document.getElementById("auditLogs");
      if (data !== null) {
        if (data.role === "ADMIN") {
          logs.classList.remove("hidden");
          handleAuditLogs();
        } else {
          logs.classList.add("hidden");
        }
        name.innerHTML = data.name;
        usernameDiv.innerHTML = data.username;
        role.innerHTML = data.role;
      }
    });
}

async function handleLogin(event, tabName) {
  event.preventDefault();
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (username === null || password === null) {
    return;
  }

  let u = username.value;
  let p = password.value;
  const response = await fetch("http://localhost:8080/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username: u,
      password: p,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      if (data === "ADMIN") {
        window.location.href = `../ui/admin.html?username=${encodeURIComponent(
          u
        )}`;
      } else if (data === "FACULTY") {
        window.location.href = ` ../ui/facultydashboard.html?username=${encodeURIComponent(
          u
        )}`;
      } else if (data === "HR") {
        window.location.href = ` ../ui/hr.html?username=${encodeURIComponent(
          u
        )}`;
      } else if (data === "ACCOUNTS") {
        window.location.href = ` ../ui/accountsdashboard.html?username=${encodeURIComponent(
          u
        )}`;
      } else {
        alert("Invalid credentials");
      }
    });
}

function profileEdit() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const profileName = document.getElementById("profileName");
  const profileImage = document.getElementById("profileImage");
  profileImage.innerHTML = username[0].toUpperCase();
  console.log(username, profileName, profileImage);

  if (username && profileName) {
    profileName.textContent = username;
  }

  return username;
}

async function getAllStaff() {
  const response = await fetch("http://localhost:8080/admin/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return response;
}

async function handleCalc(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const accounts = {};
  formData.forEach((value, key) => (accounts[key] = value));
  console.log(accounts);
  const response = await fetch("http://localhost:8080/hr/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accounts),
  })
    .then((response) => response.text())
    .then((data) => {
      if (data === "Success") {
        renderSalaryTable();
        closeCalcFormModal();
        console.log(data);
      } else {
        console.log(data);
      }
    });
}

async function getAllStaffAfterDate() {
  // pass
  const response = await fetch("http://localhost:8080/admin/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      joiningDate: "1998-01-01",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return response;
}

async function renderStaffTable() {
  const pathName = window.location.pathname;
  if (!pathName.includes("accountsdashboard")) {
    return;
  }
  let username = profileEdit();
  const profileName = document.getElementById("profileName");
  profileName.innerHTML = username;
  let staffData = await getAllStaff();

  const table = document.getElementById("tableId");
  let tbody = document.getElementById("staffTableBody");
  if (tbody == null) {
    console.log(table);
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  tbody.innerHTML = "";
  if (staffData.statusEffectiveDates == null) {
    staffData.statusEffectiveDates = "-";
  }
  staffData.forEach((staff) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.staffId
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.staffName
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.email
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              staff.statusEffectiveDates == null
                ? "-"
                : formatDate(staff.statusEffectiveDates)
            }</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="status-${staff.status.toLowerCase()}">${
      staff.status
    }</span><td></td>`;
    tbody.appendChild(row);
  });
}

function renderReportTable() {
  const response = fetch("http://localhost:8080/accounts/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    });
}

async function getAllSalaryRules() {
  const response = await fetch("http://localhost:8080/hr/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return response;
}

function printReport() {
  let currentSalaryData = [
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
  ];
  if (currentSalaryData.length === 0) {
    alert("Please calculate salary first!");
    return;
  }

  const reportContainer = document.getElementById("reportTable");
  let html = `<style>
    table {
      border-collapse: collapse;

    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      text-align: left;
      color: black;
    }
    h3 {
      text-align: center;
      margin: 10px;
    }
  </style>
  <div class="flex flex-col">
  <h3 class="text-xl font-bold">Salary Acquittance Report</h3>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Basic Pay</th>
        <th>DA</th>
        <th>HRA</th>
        <th>Allowances</th>
        <th>Gross Salary</th>
        <th>PF</th>
        <th>ESI</th>
        <th>PTIT</th>
        <th>Total Deductions</th>
        <th>Net Salary</th>
      </tr>
    </thead>
    <tbody>`;

  currentSalaryData.forEach((item) => {
    html += `
      <tr>
        <td>${item.name}</td>
        <td>${item.basicPay}</td>
        <td>${item.da}</td>
        <td>${item.hra}</td>
        <td>${item.allowances}</td>
        <td>${item.grossSalary}</td>
        <td>${item.pf}</td>
        <td>${item.esi}</td>
        <td>${item.ptit}</td>
        <td>${item.totalDeductions}</td>
        <td>${item.netSalary}</td>
      </tr>
    `;
  });
  html += `</tbody></table></div>`;

  reportContainer.innerHTML = html;
  reportContainer.style.display = "block";
}

function logout() {
  window.location.href = "../index.html";
}

document.addEventListener("click", function (e) {
  const modal = document.getElementById("addStaffModal");
  if (e.target === modal) {
    closeAddStaffModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeAddStaffModal();
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

console.log("lastScript loaded");

async function handleAuditLogs() {
  const auditLogs = document.getElementById("audit-log-list");
  const response = await fetch("http://localhost:8080/auditLogs")
    .then((response) => response.json())
    .then((data) => {
      const auditBody = document.getElementById("auditBody");

      data.forEach((item) => {
        const row = document.createElement("tr");
        console.log(data);
        row.classList.add(
          "border-b",
          "border-border-color",
          "hover:bg-bg-secondary",
          "transition"
        );
        row.innerHTML = `
        <td class="text-center py-3 px-4 border-b border-border-color text-text-primary font-medium">${item.createdDate}</td>
        <td class="text-center py-3 px-4 border-b border-border-color text-text-secondary">${item.createdTime}</td>
        <td class="text-center py-3 px-4 border-b border-border-color text-text-primary">${item.description}</td>`;
        auditBody.appendChild(row);
      });
    });
}
