document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("load", () => renderStaffTable());
  const salaryComponentRules = document.getElementById("calculationFormButton");
  salaryComponentRules.addEventListener("click", () => renderSalaryTable());

  const addStaffForm = document.getElementById("addStaffForm");
  addStaffForm.addEventListener("submit", (e) => handleAddStaff(e));

  const updateForm = document.getElementById("updateStaffForm");
  updateForm.addEventListener("submit", (e) => handleUpdateStaff(e));
});

async function getAllSalaryRules() {
  const response = await fetch("http://localhost:8080/hr/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // staffData.push(data);
      // localStorage.setItem("staffData", JSON.stringify(staffData));
      return data;
    });

  return response;
}
async function renderSalaryTable() {
  let salaryRules = await getAllSalaryRules();

  const table = document.getElementById("salaryTable");
  let tbody = document.getElementById("salaryTableBody");
  if (tbody == null) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }
  tbody.innerHTML = "";
  salaryRules.forEach((salaryRule) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${salaryRule.id}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${salaryRule.componentName}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${salaryRule.componentType}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${salaryRule.percentage}%</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${salaryRule.effectiveDate}</td>
        `;
    tbody.appendChild(row);
  });
}

async function renderStaffTable() {
  const pathName = window.location.pathname;
  let username = profileEdit();
  const profileName = document.getElementById("profileName");
  profileName.innerHTML = username;
  let staffData = await getAllStaff();
  console.log(staffData);

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
              <span 
  class="px-2 py-1 rounded-full text-sm font-semibold 
         ${
           staff.status === "ACTIVE"
             ? "bg-green-100 text-green-700"
             : staff.status === "RELIEVED"
             ? "bg-red-100 text-red-700"
             : ""
         }">
  ${staff.status}
</span><td></td>`;
    const actionCell = row.lastElementChild;
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Staff";
    editBtn.className =
      "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700";

    editBtn.addEventListener("click", () => {
      console.log(staff);

      openUpdateStaffModal(staff);
    });

    actionCell.appendChild(editBtn);
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

function openAddStaffModal() {
  document.getElementById("addStaffModal").classList.remove("hidden");
  document.getElementById("addStaffModal").classList.add("modal-enter");

  // Ensure Add Staff tab is active
  document.querySelectorAll("#addStaffModal .tab-content").forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("active");
  });

  const addTab = document.getElementById("addTab");
  addTab.classList.remove("hidden");
  addTab.classList.add("active");
}

function closeAddStaffModal() {
  const modal = document.getElementById("addStaffModal");
  modal.classList.add("hidden");
  modal.classList.remove("modal-enter");
}

function openUpdateStaffModal(staff) {
  document.getElementById("updateStaffModal").classList.remove("hidden");
  document.getElementById("updateStaffModal").classList.add("modal-enter");

  // Ensure Add Staff tab is active
  document.querySelectorAll("#updateStaffModal .tab-content").forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("active");
  });

  document.getElementById("updateStaffId").value = staff.staffId || "";
  document.getElementById("updateStaffName").value = staff.staffName || "";
  document.getElementById("updateEmail").value = staff.email || "";
  document.getElementById("updateDesignation").value = staff.designation || "";
  document.getElementById("updateDepartment").value = staff.department || "";
  document.getElementById("updateJoiningDate").value = staff.joiningDate || "";
  document.getElementById("updateBasicPay").value = staff.basicPay || "";
  document.getElementById("updateStatusEffectiveDates").value =
    staff.statusEffectiveDates || "";
  document.getElementById("updateBankDetails").value = staff.bankDetails || "";

  const updateTab = document.getElementById("updateTab");
  updateTab.classList.remove("hidden");
  updateTab.classList.add("active");
}
function closeUpdateStaffModal() {
  document.getElementById("updateStaffModal").classList.add("hidden");
  document.getElementById("updateStaffForm").reset();
}

async function handleAddStaff(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const staff = {};
  formData.forEach((value, key) => (staff[key] = value));
  console.log(staff);
  const response = await fetch("http://localhost:8080/admin/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  })
    .then((response) => response.text())
    .then((data) => {
      // staffData.push(data);
      // localStorage.setItem("staffData", JSON.stringify(staffData));
      if (data === "Success") {
        document.getElementById("staffId").value = "";
        document.getElementById("staffName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("designation").value = "";
        document.getElementById("department").value = "";
        document.getElementById("joiningDate").value = "";
        document.getElementById("basicPay").value = "";
        document.getElementById("statusEffectiveDates").value = "";
        renderStaffTable();
        closeAddStaffModal();
      }
    });
}

async function handleUpdateStaff(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const staff = {};
  formData.forEach((value, key) => (staff[key] = value));
  console.log(staff);

  const response = await fetch("http://localhost:8080/admin/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  })
    .then((response) => response.text())
    .then((data) => {
      if (data === "Success") {
        renderStaffTable();
        closeUpdateStaffModal();
      } else {
        console.log("Error");
      }
    });
}

function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-button");

  // Hide modal tabs differently
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

function openCalcFormModal() {
  document.getElementById("salaryComponentRulesTab").classList.remove("hidden");
  document
    .getElementById("salaryComponentRulesTab")
    .classList.add("modal-enter");

  // Ensure Add Staff tab is active
  document
    .querySelectorAll("#salaryComponentRulesTab .tab-content")
    .forEach((el) => {
      el.classList.add("hidden");
      el.classList.remove("active");
    });

  const addTab = document.getElementById("calculationFormTab");
  addTab.classList.remove("hidden");
  addTab.classList.add("active");
}
