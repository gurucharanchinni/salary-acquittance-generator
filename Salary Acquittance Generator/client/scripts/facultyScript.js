document.addEventListener("DOMContentLoaded", function (e) {
  window.addEventListener("load", () => handlePaySlipTable());

  const monthWise = document.getElementById("monthWise");
  monthWise.addEventListener("click", () => showMonthWise());

  const profileLink = document.getElementById("profileLink");
  if (profileLink)
    profileLink.addEventListener("click", (e) => handleProfile(e));
});

async function handlePaySlipTable() {
  let username = profileEdit();
  const formDataEmail = new FormData();
  formDataEmail.append("username", username);

  const response = await fetch("http://localhost:8080/admin/getemail", {
    method: "POST",
    body: formDataEmail,
  });
  if (!response.ok) return;

  let email = await response.text();
  if (!email) return;
  console.log(email);

  const formData = new FormData();
  formData.append("email", email);

  const response1 = await fetch("http://localhost:8080/payslip/getpayslip", {
    method: "POST",
    body: formData,
  });
  if (!response1.ok) return;

  let data = await response1.json();
  if (!data) return;

  if (!Array.isArray(data)) data = [data];
  console.log(data);

  const table = document.getElementById("paysliptable");
  const tbody = document.getElementById("paySalaryTbody");

  tbody.innerHTML = "";
  table.classList.remove("hidden");

  data.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="text-center px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
      <td class="text-center px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
      <td class="px-4 py-4 flex justify-center"></td>
    `;

    const actionCell = row.lastElementChild;
    const editBtn = document.createElement("button");
    editBtn.textContent = "Download PDF";
    editBtn.className =
      "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700";

    editBtn.addEventListener("click", () => {
      downloadPDF([payslip]);
    });

    actionCell.appendChild(editBtn);
    tbody.appendChild(row);
  });
}

function profileEdit() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const pathName = window.location.pathname.toLowerCase();
  console.log(pathName);

  if (pathName.includes("dashboard") || pathName.includes("profile")) {
    const profileName = document.getElementById("profileName");
    const profileImage = document.getElementById("profileImage");
    profileName.innerHTML = username;
    profileImage.innerHTML = username[0].toUpperCase();
  }
  return username;
}

async function downloadPDF(salaryData) {
  if (!salaryData || !salaryData.length) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFont("courier", "bold");
  doc.setFontSize(16);
  doc.text("NARAYANA ENGINEERING COLLEGE", 20, 20);

  doc.setFontSize(12);
  doc.setFont("courier", "normal");
  doc.text(`Salary Acquittance Report`, 20, 30);

  let y = 40;

  for (let slip of salaryData) {
    let startDate = slip.startDate;
    let endDate = slip.endDate;
    doc.text(`Start Date: ${startDate}`, 20, y);
    doc.text(`End Date: ${endDate}`, 100, y);
    y += 10;

    const response = await fetch(
      `http://localhost:8080/admin/getbyid?staffId=${slip.staffId}`
    );
    const staff = await response.json();

    doc.setFont("courier", "bold");
    doc.text("Staff Details:", 20, y);
    y += 8;

    doc.setFont("courier", "normal");
    const staffDetails = [
      `Staff Id: ${staff.staffId}`,
      `Staff Name: ${staff.staffName}`,
      `Email: ${staff.email || "-"}`,
      `Designation: ${staff.designation || "-"}`,
      `Department: ${staff.department || "-"}`,
      `JoiningDate: ${staff.joiningDate || "-"}`,
      `Basic Pay: Rs. ${parseFloat(staff.basicPay).toLocaleString("en-IN")}`,
      `Bank Details: ${staff.bankDetails || "-"}`,
    ];
    staffDetails.forEach((line) => {
      doc.text(line, 30, y);
      y += 6;
    });

    doc.setFont("courier", "bold");
    doc.text("Allowances:", 20, y);
    y += 6;
    doc.setFont("courier", "normal");
    doc.text(`HRA: Rs. ${parseFloat(slip.hra).toLocaleString("en-IN")}`, 30, y);
    y += 6;
    doc.text(`TA: Rs. ${parseFloat(slip.ta).toLocaleString("en-IN")}`, 30, y);
    y += 6;
    doc.text(`DA: Rs. ${parseFloat(slip.da).toLocaleString("en-IN")}`, 30, y);
    y += 8;

    doc.setFont("courier", "bold");
    doc.text(
      `Gross Salary: Rs. ${parseFloat(slip.grossSal).toLocaleString("en-IN")}`,
      20,
      y
    );
    y += 8;

    doc.text("Deductions:", 20, y);
    y += 6;
    doc.setFont("courier", "normal");
    doc.text(`PF: Rs. ${parseFloat(slip.pf).toLocaleString("en-IN")}`, 30, y);
    y += 6;
    doc.text(`ESI: Rs. ${parseFloat(slip.esi).toLocaleString("en-IN")}`, 30, y);
    y += 6;
    doc.text(`IT: Rs. ${parseFloat(slip.it).toLocaleString("en-IN")}`, 30, y);
    y += 8;

    doc.setFont("courier", "bold");
    doc.text(
      `Net Salary: Rs. ${parseFloat(slip.netSal).toLocaleString("en-IN")}`,
      20,
      y
    );
    y += 15;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  }

  const start = salaryData[0].startDate;
  const end = salaryData[0].endDate;
  doc.save(`salary-report-${start}-to-${end}.pdf`);
}

async function showYearWise() {
  const yearInput = document.getElementById("year");
  const formData = new FormData();
  formData.append("year", yearInput.value);
  const response = await fetch("http://localhost:8080/payslip/yearwise", {
    method: "POST",
    body: formData,
  });
  let data = await response.json();
  if (!data) return [];

  const tbody = document.getElementById("paySalaryTbody");
  tbody.innerHTML = "";
  data.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.basicPay}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.hra}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.da}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.ta}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.grossSal}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.pf}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.esi}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.it}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.netSal}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.department}</td>
        `;
    tbody.appendChild(row);
  });
}

async function showMonthWise() {
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year1");
  let username = profileEdit();
  const emailFormData = new FormData();
  emailFormData.append("username", username);
  const emailResponse = await fetch("http://localhost:8080/admin/getemail", {
    method: "POST",
    body: emailFormData,
  });
  const emailData = await emailResponse.text();
  const formData = new FormData();
  formData.append("month", monthInput.value);
  formData.append("year", yearInput.value);
  formData.append("email", emailData);
  const response = await fetch("http://localhost:8080/payslip/getmonthwise", {
    method: "POST",
    body: formData,
  });
  let data = await response.json();
  if (!data) return [];
  console.log(data);
  const tbody = document.getElementById("paySalaryTbody");
  tbody.innerHTML = "";
  data.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
            <td class="px-4 py-4 flex justify-center"></td>
            `;

    const actionCell = row.lastElementChild;
    const editBtn = document.createElement("button");
    editBtn.textContent = "Download PDF";
    editBtn.className =
      "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700";

    editBtn.addEventListener("click", () => {
      downloadPDF([payslip]);
    });

    actionCell.appendChild(editBtn);
    tbody.appendChild(row);
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
