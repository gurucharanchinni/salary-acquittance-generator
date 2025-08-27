document.addEventListener("DOMContentLoaded", function (e) {
  if (isLastDayOfMonth()) handleSalaryWithDate();
  profileEdit();
  const calcSalaryForm = document.getElementById("salaryCalculatorForm");
  if (calcSalaryForm)
    calcSalaryForm.addEventListener("submit", (e) => handleSalaryTable(e));

  const profileLink = document.getElementById("profileLink");
  if (profileLink)
    profileLink.addEventListener("click", (e) => handleProfile(e));
});
async function handleSalaryWithDate() {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = lastDayOfMonth;

  const formatDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  if (startDateInput && endDateInput) {
    startDateInput.value = formatDate(startDate);
    endDateInput.value = formatDate(endDate);
  }

  let data = await handleSalCalculation();
  await handleSalary(data);
}

function isLastDayOfMonth() {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate());
  const is10DaysLaterLastDay =
    futureDate.getDate() === lastDayOfMonth.getDate() &&
    futureDate.getMonth() === lastDayOfMonth.getMonth() &&
    futureDate.getFullYear() === lastDayOfMonth.getFullYear();

  return is10DaysLaterLastDay;
}
async function handleSalCalculation() {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  let s = startDateInput.value;
  let ed = endDateInput.value;
  let formData = new FormData();
  formData.append("startDate", s);
  formData.append("endDate", ed);
  console.log(startDateInput, endDateInput);
  startDateInput.value = "";
  endDateInput.value = "";
  const response = await fetch("http://localhost:8080/payslip/generate", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Http status " + response.status);
  }
  const data = await response.json();
  if (!data) {
    return [];
  }
  return data;
}

async function handleSalary(data) {
  const table = document.getElementById("calcTable");
  const tbody = document.getElementById("calcSalaryBody");
  document.getElementById("calculateSalary").classList.remove("hidden");
  if (tbody === null) {
    table.appendChild(document.createElement("tbody"));
  }
  tbody.innerHTML = "";
  data.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffId}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffName}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.basicPay}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.hra}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.ta}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.da}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.grossSal}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.pf}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.esi}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.it}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.netSal}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
        `;
    tbody.appendChild(row);
  });
}
async function handleSalaryTable(e) {
  e.preventDefault();
  const table = document.getElementById("calcTable");
  const tbody = document.getElementById("calcSalaryBody");
  document.getElementById("calculateSalary").classList.remove("hidden");
  if (tbody === null) {
    table.appendChild(document.createElement("tbody"));
  }
  console.log(tbody);
  let data = await handleSalCalculation();
  console.log(data, table, tbody);
  tbody.innerHTML = "";
  data.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffId}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffName}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.basicPay}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.hra}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.ta}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.da}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.grossSal}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.pf}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.esi}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.it}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.netSal}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
        `;
    tbody.appendChild(row);
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

async function handleProfile(e) {
  e.preventDefault();
  let username = profileEdit();
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
      if (data !== null) {
        name.innerHTML = data.name;
        usernameDiv.innerHTML = data.username;
        role.innerHTML = data.role;
      } else {
        console.log(data);
      }
    });
}

function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-button");
  if (tabName === "add") {
    document.getElementById("addTab").classList.remove("hidden");
    document.getElementById("updateTab").classList.add("hidden");
  } else if (tabName === "update") {
    document.getElementById("addTab").classList.add("hidden");
    document.getElementById("updateTab").classList.remove("hidden");
  } else {
    tabs.forEach((tab) => tab.classList.add("hidden"));
  }
  buttons.forEach((btn) => {
    btn.classList.remove("border-blue-500", "text-blue-600");
    btn.classList.add("border-transparent", "text-gray-500");
  });
  const selectedTab = document.getElementById(tabName + "Tab");
  if (!selectedTab) {
    console.error(`Tab element with id "${tabName}Tab" not found.`);
    return;
  }
  selectedTab.classList.remove("hidden");

  const selectedButton = Array.from(buttons).find((btn) =>
    btn.textContent.toLowerCase().includes(tabName)
  );
  if (selectedButton) {
    selectedButton.classList.remove("border-transparent", "text-gray-500");
    selectedButton.classList.add("border-blue-500", "text-blue-600");
  }
}
