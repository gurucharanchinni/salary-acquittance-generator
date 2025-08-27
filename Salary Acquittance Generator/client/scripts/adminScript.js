let currentPage = 0;
let pageSize = 5;
let totalPages = 0;
let analytics = true,
  year = false,
  month = false,
  department = false;
let myChart = null;
let myChart3 = null;

document.addEventListener("DOMContentLoaded", function (e) {
  renderAnalyticsTable();
  handleGraph();
  handleGraph1();
  handleGraph2();
  const paySlipApprovalBtn = document.getElementById("paySlipApproval");
  paySlipApprovalBtn.addEventListener("click", () => changeApproval());

  const analyticsModalBtn = document.getElementById("analyticsModalBtn");
  analyticsModalBtn.addEventListener("click", () => openAnalyticsModal());

  const paySlip = document.getElementById("paySlip");
  paySlip.addEventListener("click", () => renderNApprovedPaySlips());

  const updateForm = document.getElementById("updateStaffForm");
  updateForm.addEventListener("submit", (e) => handleUpdateStaff(e));

  const analyticsBtn = document.getElementById("analyticsBtn");
  analyticsBtn.addEventListener("click", () => renderAnalyticsTable());

  const yearWise = document.getElementById("yearWise");
  yearWise.addEventListener("click", () => showYearWise());

  const monthWise = document.getElementById("monthWise");
  monthWise.addEventListener("click", () => showMonthWise());

  const salaryComponentRules = document.getElementById("salaryComponentRules");
  salaryComponentRules.addEventListener("click", () => renderSalaryTable());

  const salaryForm = document.getElementById("salaryForm");
  salaryForm.addEventListener("submit", (e) => handleCalc(e));

  const staffTab = document.getElementById("staffBtn");
  staffTab.addEventListener("click", () => renderStaffTable());

  const pdfExport = document.getElementById("pdfExport");
  pdfExport.addEventListener("click", () =>
    downloadPDF(analytics, year, month, department)
  );

  const excelExport = document.getElementById("excelExport");
  excelExport.addEventListener("click", () =>
    downloadExcel(analytics, year, month, department)
  );
});

async function handleGraph1() {
  const response = await fetch("http://localhost:8080/payslip/latestRules", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let salData = await response.json();
  const ctx = document.getElementById("myChart2").getContext("2d");
  const data = {
    labels: ["HRA", "DA", "TA", "PF", "ESI", "IT"],
    datasets: [
      {
        label: "Component Values",
        data: salData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  const myChart = new Chart(ctx, config);
}

async function changeApproval() {
  const payTable = document.getElementById("paySlipTBody");
  const rows = payTable.querySelectorAll("tr");
  console.log(rows);
  let payData = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    console.log(cells);

    payData.push({
      staffId: cells[0].textContent.trim(),
      staffName: cells[1].textContent.trim(),
      basicPay: cells[2].textContent.trim(),
      hra: cells[3].textContent.trim(),
      da: cells[4].textContent.trim(),
      ta: cells[5].textContent.trim(),
      grossSalary: cells[6].textContent.trim(),
      pf: cells[7].textContent.trim(),
      esi: cells[8].textContent.trim(),
      it: cells[9].textContent.trim(),
      netSalary: cells[10].textContent.trim(),
      startDate: cells[11].textContent.trim(),
      endDate: cells[12].textContent.trim(),
    });
  });
  console.log(payData);

  for (const pay of payData) {
    const formData = new FormData();
    formData.append("id", pay.staffId);

    const response = await fetch("http://localhost:8080/payslip/setapproval", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Http status " + response.status);
    }

    await response.text();
  }

  renderNApprovedPaySlips();
  renderAnalyticsTable();
}

async function handleGraph2(year = false, month = false, department = false) {
  let response;
  if (department) {
    const val = document.getElementById("department").value;
    const formData = new FormData();
    formData.append("department", val);
    response = await fetch(
      "http://localhost:8080/payslip/calculateSalaryDepartment",
      {
        method: "POST",
        body: formData,
      }
    );
  } else if (year) {
    const yearInput = document.getElementById("year");
    const formData = new FormData();
    formData.append("year", yearInput.value);
    response = await fetch(
      "http://localhost:8080/payslip/calculateSalaryYear",
      {
        method: "POST",
        body: formData,
      }
    );
  } else if (month) {
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year1");
    const formData = new FormData();
    formData.append("month", monthInput.value);
    formData.append("year", yearInput.value);
    response = await fetch(
      "http://localhost:8080/payslip/calculateSalaryMonth",
      {
        method: "POST",
        body: formData,
      }
    );
  } else {
    response = await fetch("http://localhost:8080/payslip/calculateSalary", {
      method: "GET",
    });
  }
  let data = await response.json();
  const labels = ["Basic Pay", "HRA", "DA", "TA", "PF", "ESI", "IT"];
  const values = [
    data.BasicPay,
    data.HRA,
    data.DA,
    data.TA,
    data.PF,
    data.ESI,
    data.IT,
  ];

  if (year || month || department) {
    myChart3.destroy();
  }
  const ctx = document.getElementById("myChart3").getContext("2d");
  myChart3 = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FF9800",
            "#9C27B0",
            "#F44336",
            "#00BCD4",
            "#8BC34A",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let value = context.raw.toLocaleString();
              return `${context.label}: ${value}`;
            },
          },
        },
      },
    },
  });
}

async function handleGraph(year = false, month = false, department = false) {
  const ctx = document.getElementById("myChart1").getContext("2d");

  // Example data
  const departments = ["CSE", "ECE", "EEE", "MECH", "CIV"];
  const staffCount = [];
  const netSalary = [];
  for (var i of departments) {
    if (year) {
      staffCount.push(await noofStaffPerDepartment(i, true));
      netSalary.push(await addNetSal(i, true));
    } else if (month) {
      staffCount.push(await noofStaffPerDepartment(i, false, true));
      netSalary.push(await addNetSal(i, false, true));
    } else {
      staffCount.push(await noofStaffPerDepartment(i));
      netSalary.push(await addNetSal(i));
    }
  }
  if (year || month || department) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: departments,
      datasets: [
        {
          label: "Number of Staff",
          data: staffCount,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "No. of Staff",
          },
        },
        x: {
          title: {
            display: true,
            text: "Departments",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const salary = netSalary[index];
              return `Net Salary: $${salary.toLocaleString()}`;
            },
          },
        },
      },
    },
  });
  if (year) {
    myChart.update();
  }
}

async function noofStaffPerDepartment(
  dept = "all",
  year = false,
  month = false
) {
  let data;
  if (year) {
    data = await showYear();
  } else if (month) {
    data = await showMonth();
  } else {
    data = await analyticsTable();
  }

  if (!data) return 0;
  const s = new Set();
  const allS = new Set();
  data.forEach((staff) => {
    if (staff.department == dept && dept != "all") {
      s.add(staff.staffId);
    }
    allS.add(staff.staffId);
  });
  if (dept == "all") return allS.size;
  return s.size;
}

async function addNetSal(dept, year = false, month = false) {
  let data;
  if (year) {
    data = await showYear();
  } else if (month) {
    data = await showMonth();
  } else {
    data = await analyticsTable();
  }
  let netSal = 0;
  data.forEach((staff) => {
    if (staff.department == dept) {
      netSal += staff.netSal;
    }
  });
  return netSal;
}

async function renderStaffTable() {
  const pathName = window.location.pathname;
  let username = profileEdit();
  const profileName = document.getElementById("profileName");
  const profileImage = document.getElementById("profileImage");
  profileName.innerHTML = username;
  profileImage.innerHTML = username[0];
  let staffData = await getAllStaff();
  console.log(staffData);
  table = document.getElementById("tableId");
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
  ${staff.status}</span>
<td></td>`;
    tbody.appendChild(row);
  });
}

async function downloadPDF(
  analytics = true,
  year = false,
  month = false,
  department = false
) {
  let data;
  if (analytics) {
    data = await analyticsTable();
  } else if (year) {
    data = await showYear();
  } else if (month) {
    data = await showMonth();
  } else if (department) {
    data = await departmentWise();
  }
  data = data.content || data;

  let currentSalaryData = data.map((payslip, index) => ({
    sNo: index + 1,
    staffId: payslip.staffId,
    staffName: payslip.staffName,
    designation: payslip.designation || "",
    basicPay: payslip.basicPay,
    da: payslip.da,
    hra: payslip.hra,
    grossSal: payslip.grossSal,
    pf: payslip.pf,
    esi: payslip.esi,
    it: payslip.it,
    netSal: payslip.netSal,
    startDate: payslip.startDate,
    endDate: payslip.endDate,
  }));

  let currentPeriod =
    currentSalaryData[0].startDate + " to " + currentSalaryData[0].endDate;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4");

  doc.setFontSize(16);
  doc.text("Salary Acquittance Register", 20, 20);
  doc.setFontSize(12);
  doc.text("Institution Name: ____________________", 20, 30);
  doc.text("Department: _________________________", 20, 37);
  doc.text(`Month & Year: ${currentPeriod}`, 20, 44);
  const headers = [
    "S.No",
    "Emp ID",
    "Employee Name",
    "Designation",
    "Basic Pay (₹)",
    "DA (₹)",
    "HRA (₹)",
    "Gross Salary (₹)",
    "PF (₹)",
    "ESI (₹)",
    "PT/IT (₹)",
    "Net Salary (₹)",
  ];

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return val;
    return (
      "₹" +
      parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })
    );
  };

  const tableData = currentSalaryData.map((staff) => [
    staff.sNo,
    staff.staffId,
    staff.staffName,
    staff.designation,
    formatCurrency(staff.basicPay),
    formatCurrency(staff.da),
    formatCurrency(staff.hra),
    formatCurrency(staff.grossSal),
    formatCurrency(staff.pf),
    formatCurrency(staff.esi),
    formatCurrency(staff.it),
    formatCurrency(staff.netSal),
  ]);

  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 55,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [71, 85, 105] },
  });

  doc.save(`salary-acquittance-${currentPeriod.replace(" ", "-")}.pdf`);
}

async function downloadExcel(
  analytics = true,
  year = false,
  month = false,
  department = false
) {
  
  const response = await fetch(
    `http://localhost:8080/payslip?page=0&size=1000`
  );
  const data = await response.json();

  if (!data.content || data.content.length === 0) {
    alert("No records found!");
    return;
  }

  const headers = [
    "StaffID",
    "StaffName",
    "Basic Pay",
    "DA",
    "HRA",
    "TA",
    "Gross Salary",
    "PF",
    "ESI",
    "Professional Tax (IT)",
    "Net Salary",
    "Start Date",
    "End Date",
    "Department",
  ];

  const formatCurrency = (val) =>
    val && !isNaN(val) ? "₹" + Number(val).toLocaleString("en-IN") : val;

  const excelData = data.content.map((s) => [
    s.staffId,
    s.staffName,
    formatCurrency(s.basicPay),
    formatCurrency(s.da),
    formatCurrency(s.hra),
    formatCurrency(s.ta),
    formatCurrency(s.grossSal),
    formatCurrency(s.pf),
    formatCurrency(s.esi),
    formatCurrency(s.it),
    formatCurrency(s.netSal),
    s.startDate,
    s.endDate,
    s.department || "",
  ]);

  
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelData]);

  const colWidths = headers.map((h) => ({ wch: h.length + 10 }));
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Report");

  XLSX.writeFile(workbook, "Salary-Report.xlsx");
}

async function showYear() {
  const yearInput = document.getElementById("year");
  const formData = new FormData();
  formData.append("year", yearInput.value);
  const response = await fetch("http://localhost:8080/payslip/yearwise", {
    method: "POST",
    body: formData,
  });
  let data = await response.json();
  console.log(data);

  if (!data) return [];
  return data;
}

async function showYearWise(page = 0, size = 5) {
  const yearInput = document.getElementById("year");
  const monthInput = document.getElementById("month");
  const year1Input = document.getElementById("year1");
  const department = document.getElementById("department");

  monthInput.selectedIndex = 0;
  year1Input.value = "";
  department.value = "";
  const formData = new FormData();
  formData.append("year", yearInput.value);
  const response = await fetch(
    `http://localhost:8080/payslip/yearwisepage?page=${page}&size=${size}`,
    {
      method: "POST",
      body: formData,
    }
  );
  let data = await response.json();
  if (!data) return [];
  console.log(data);
  year = true;
  analytics = false;
  let noData = await showYear();
  let sSize = await noofStaffPerDepartment("all", true);
  const nostaff = document.getElementById("nostaff");
  nostaff.innerHTML = `No of staff: ${sSize}`;
  handleGraph(true, false);
  handleGraph2(true, false, false);
  const totalnetsalary = document.getElementById("totalnetsalary");
  totalnetsalary.innerHTML = `Total Net Salary: ${noData.reduce(
    (a, b) => a + b.netSal,
    0
  )}`;
  currentPage = data.page.number ? data.page.number : 0;
  totalPages = data.page.totalPages || 0;
  const tbody = document.getElementById("analyticsBody");
  tbody.innerHTML = "";
  data.content.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffId}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffName}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.basicPay}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.hra}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.da}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.ta}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.grossSal}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.pf}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.esi}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.it}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.netSal}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.department}</td>
        `;
    tbody.appendChild(row);
  });
  renderPaginationControls(false, true, false, false);
}

async function showMonth(page = 0, size = 5) {
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year1");
  const formData = new FormData();
  formData.append("month", monthInput.value);
  formData.append("year", yearInput.value);
  const response = await fetch(`http://localhost:8080/payslip/monthwise`, {
    method: "POST",
    body: formData,
  });

  let data = await response.json();
  if (!data) return [];

  console.log(data.length, data);
  return data;
}

async function showMonthWise(page = 0, size = 5) {
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year1");
  const year1Input = document.getElementById("year");
  const department = document.getElementById("department");
  const formData = new FormData();
  formData.append("month", monthInput.value);
  formData.append("year", yearInput.value);
  const response = await fetch(
    `http://localhost:8080/payslip/monthwisepage?page=${page}&size=${size}`,
    {
      method: "POST",
      body: formData,
    }
  );
  let data = await response.json();
  if (!data) return [];
  handleGraph(false, true);
  year1Input.value = "";
  department.value = "";
  console.log(data);
  month = true;
  analytics = false;
  let noData = await showMonth();
  const nostaff = document.getElementById("nostaff");
  nostaff.innerHTML = `No of staff: ${noData.length}`;
  const totalnetsalary = document.getElementById("totalnetsalary");
  totalnetsalary.innerHTML = `Total Net Salary: ${noData.reduce(
    (a, b) => a + b.netSal,
    0
  )}`;
  handleGraph2(false, true, false);
  currentPage = data.page.number ? data.page.number : 0;
  totalPages = data.page.totalPages || 0;
  const tbody = document.getElementById("analyticsBody");
  tbody.innerHTML = "";
  data.content.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffId}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffName}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.basicPay}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.hra}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.da}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.ta}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.grossSal}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.pf}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.esi}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.it}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.netSal}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.department}</td>
            `;
    tbody.appendChild(row);
  });
  renderPaginationControls(false, false, true, false);
}

async function analyticsTable() {
  const response = await fetch("http://localhost:8080/payslip", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  let data = await response.json();
  if (!data) return [];
  return data;
}

async function renderAnalyticsTable(page = 0, size = 5) {
  const response = await fetch(
    `http://localhost:8080/payslip/page?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  let data = await response.json();
  console.log("Paginated Data:", data);

  currentPage = data.page.number ? data.page.number : 0;
  totalPages = data.page.totalPages || 0;

  let noData = await analyticsTable();
  const nostaff = document.getElementById("nostaff");
  let sSize = await noofStaffPerDepartment("all");
  nostaff.innerHTML = `No of staff: ${sSize}`;
  const totalnetsalary = document.getElementById("totalnetsalary");
  totalnetsalary.innerHTML = `Total Net Salary: ${noData.reduce(
    (a, b) => a + b.netSal,
    0
  )}`;
  
  const tbody = document.getElementById("analyticsBody");
  tbody.innerHTML = "";
  data.content.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.staffId}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.staffName}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.basicPay}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.hra}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.da}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.ta}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.grossSal}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.pf}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.esi}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.it}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.netSal}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.startDate}</td>
      <td class="px-5 py-4 text-sm text-gray-900">${payslip.endDate}</td>
      <td class="text-center px-5 py-4 text-sm text-gray-900">${payslip.department}</td>
    `;
    tbody.appendChild(row);
  });

  renderPaginationControls();
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

function openCalcFormModal() {
  document.getElementById("salaryComponentRulesTab").classList.remove("hidden");
  document
    .getElementById("salaryComponentRulesTab")
    .classList.add("modal-enter");

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

function closeCalcFormModal() {
  document.getElementById("calculationFormTab").classList.add("hidden");
}

function openAnalyticsModal() {
  document.getElementById("analyticsModal").classList.remove("hidden");
  document.getElementById("analyticsModal").classList.add("modal-enter");
}

function closeAnalyticsModal() {
  document.getElementById("analyticsModal").classList.add("hidden");
}

async function renderNApprovedPaySlips(payData) {
  const response = await fetch("http://localhost:8080/payslip/getrejected", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();
  if (!data) {
    return [];
  }

  const tbody = document.getElementById("paySlipTBody");
  tbody.innerHTML = "";
  const pending = document.getElementById("pending");
  pending.innerHTML = `Pending: ${data.length}`;
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
            <td class="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.department}</td>
              `;
    tbody.appendChild(row);
  });
}
function renderPaginationControls(
  analytics = true,
  year = false,
  month = false,
  department = false
) {
  const paginationDiv = document.getElementById("paginationControls");
  paginationDiv.innerHTML = `
    <button id="prevPage" class="px-3 py-1 bg-gray-200 rounded" ${
      currentPage === 0 ? "disabled" : ""
    }>Prev</button>
    <span class="px-4">Page ${currentPage + 1} of ${totalPages}</span>
    <button id="nextPage" class="px-3 py-1 bg-gray-200 rounded" ${
      currentPage + 1 === totalPages ? "disabled" : ""
    }>Next</button>
  `;

  if (analytics) {
    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 0) renderAnalyticsTable(currentPage - 1, pageSize);
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage + 1 < totalPages)
        renderAnalyticsTable(currentPage + 1, pageSize);
    });
  } else if (year) {
    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 0) showYearWise(currentPage - 1, pageSize);
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage + 1 < totalPages) showYearWise(currentPage + 1, pageSize);
    });
  } else if (month) {
    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 0) showMonthWise(currentPage - 1, pageSize);
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage + 1 < totalPages)
        showMonthWise(currentPage + 1, pageSize);
    });
  } else if (department) {
    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 0) departmentWiseFilter(currentPage - 1, pageSize);
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage + 1 < totalPages)
        departmentWiseFilter(currentPage + 1, pageSize);
    });
  }
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

async function departmentWise() {
  const val = document.getElementById("department").value;
  const formData = new FormData();
  formData.append("department", val);
  const response = await fetch("http://localhost:8080/payslip/department", {
    method: "POST",
    body: formData,
  });

  let data = await response.json();
  if (!data) return [];
  return data;
}

async function departmentWiseFilter(page = 0, size = 5) {
  const val = document.getElementById("department").value;
  const yearInput = document.getElementById("year");
  const monthInput = document.getElementById("month");
  const year1Input = document.getElementById("year1");
  const formData = new FormData();
  formData.append("department", val);
  const response = await fetch(
    `http://localhost:8080/payslip/departmentpage?page=${page}&size=${size}`,
    {
      method: "POST",
      body: formData,
    }
  );

  yearInput.value = "";
  monthInput.selectedIndex = 0;
  year1Input.value = "";
  let data = await response.json();
  if (!data) {
    return [];
  }
  department = true;
  analytics = false;
  let noData = await departmentWise();
  const nostaff = document.getElementById("nostaff");
  let sSize = await noofStaffPerDepartment(val, false, false, true);
  nostaff.innerHTML = `No of staff: ${sSize}`;
  const totalnetsalary = document.getElementById("totalnetsalary");
  totalnetsalary.innerHTML = `Total Net Salary: ${noData.reduce(
    (a, b) => a + b.netSal,
    0
  )}`;
  handleGraph2(false, false, true);
  currentPage = data.page.number ? data.page.number : 0;
  totalPages = data.page.totalPages || 0;
  val.selectedIndex = 0;
  const tbody = document.getElementById("analyticsBody");
  tbody.innerHTML = "";
  data.content.forEach((payslip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffId}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.staffName}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.basicPay}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.hra}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.da}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.ta}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.grossSal}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.esi}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.pf}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.it}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.netSal}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.startDate}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.endDate}</td>
            <td class="text-center px-5 py-4 whitespace-nowrap text-sm text-gray-900">${payslip.department}</td>
              `;
    tbody.appendChild(row);
  });
  renderPaginationControls(false, false, false, true);
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

console.log(analytics, year, month, department);
