package com.gurucharan.salaryacquittanceapi.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gurucharan.salaryacquittanceapi.annotation.LoggableAction;
import com.gurucharan.salaryacquittanceapi.model.PaySlip;
import com.gurucharan.salaryacquittanceapi.model.SalaryComponents;
import com.gurucharan.salaryacquittanceapi.model.SalaryList;
import com.gurucharan.salaryacquittanceapi.model.Staff;
import com.gurucharan.salaryacquittanceapi.repository.PaySlipRepository;
import com.gurucharan.salaryacquittanceapi.repository.SalaryComponentRepository;
import com.gurucharan.salaryacquittanceapi.repository.SalaryListRepository;
import com.gurucharan.salaryacquittanceapi.repository.StaffRepository;
import com.gurucharan.salaryacquittanceapi.utils.Approval;
import com.gurucharan.salaryacquittanceapi.utils.CalculateEffDate;

@Service
public class PaySlipService {
    private final PaySlipRepository paySlipRepository;
    private final SalaryComponentRepository salaryComponentRepository;
    private final SalaryListRepository salaryListRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public PaySlipService(PaySlipRepository paySlipRepository, StaffRepository staffRepository,
            SalaryComponentRepository salaryComponentRepository, SalaryListRepository salaryListRepository) {
        this.paySlipRepository = paySlipRepository;
        this.salaryComponentRepository = salaryComponentRepository;
        this.salaryListRepository = salaryListRepository;
        this.staffRepository = staffRepository;
    }

    public List<PaySlip> getAllPaySlip() {
        return paySlipRepository.findAllByApproval(Approval.Approved);
    }

    public Page<PaySlip> getAllPaySlip(Pageable pageable) {
        return paySlipRepository.findAll(pageable);
    }

    public PaySlip getPaySlipById(Long id) {
        return paySlipRepository.findById(id).orElse(null);
    }

    public List<PaySlip> getPaySlipByStaffId(String staffId) {
        return paySlipRepository.findByStaffId(staffId);
    }

    public Page<PaySlip> getApprovedPaySlip(Pageable page) {
        return paySlipRepository.findAllByApproval(Approval.Approved, page);
    }

    public List<PaySlip> getNotApprovalPaySlip() {
        return paySlipRepository.findAllByApproval(Approval.Rejected);
    }

    @LoggableAction("Approval for Staff with ")
    public String setApproval(String staffId) {
        List<PaySlip> payslips = paySlipRepository.findAllByStaffId(staffId);

        if (payslips == null || payslips.isEmpty()) {
            return "No PaySlips found for staffId: " + staffId;
        }

        for (PaySlip p : payslips) {
            if (p.getApproval() == Approval.Rejected) {
                p.setApproval(Approval.Approved);
            }
            paySlipRepository.save(p);
        }

        return "Approval Changed Successfully for " + payslips.size() + " payslip(s)";
    }

    public List<PaySlip> getPaySlipByDate(String startDate, String endDate) {
        return paySlipRepository.findAllByStartDateBetweenAndApproval(LocalDate.parse(startDate),
                LocalDate.parse(endDate),
                Approval.Approved);
    }

    public List<PaySlip> getPaySlipsByEmail(String email) {
        Staff s = staffRepository.findByEmail(email).orElse(null);
        System.out.println(s);
        List<PaySlip> p = paySlipRepository.findAllByStaffId(s.getStaffId());
        List<PaySlip> approvedP = new ArrayList<>();
        for (var e : p) {
            if (e.getApproval() == Approval.Approved) {
                approvedP.add(e);
            }
        }
        return approvedP;
    }

    @LoggableAction("New PaySlips are generated")
    public List<PaySlip> savePaySlip(String startDate, String endDate) {
        List<SalaryList> sl = salaryListRepository.findAll();
        List<String> allowances = new ArrayList<>();
        allowances.add("HRA");
        allowances.add("TA");
        allowances.add("DA");
        List<String> deductions = new ArrayList<>();
        deductions.add("PF");
        deductions.add("ESI");
        deductions.add("IT");
        for (var i : sl) {
            Staff s = i.getStaff();
            if (!paySlipRepository.existsByStaffIdAndStartDateAndEndDate(s.getStaffId(), LocalDate.parse(startDate),
                    LocalDate.parse(endDate))) {
                PaySlip p = new PaySlip();
                p.setBasicPay(s.getBasicPay());
                p.setStaffName(s.getStaffName());
                p.setStaffId(s.getStaffId());
                p.setEndDate(LocalDate.parse(endDate));
                p.setStartDate(LocalDate.parse(startDate));
                p.setApproval(Approval.Rejected);
                p.setDepartment(s.getDepartment());
                Double grossSal = 0.0d;
                Double amt = 0.0d;

                Double perDaybp = s.getBasicPay() / (ChronoUnit.DAYS.between(p.getStartDate(), p.getEndDate()) + 1.0d);

                for (var j : allowances) {
                    Deque<LocalDate> dateTracker = new ArrayDeque<>();
                    Deque<Double> valueTracker = new ArrayDeque<>();
                    dateTracker.push(p.getEndDate());
                    valueTracker.push(0.0d);

                    List<SalaryComponents> tsc = salaryComponentRepository
                            .findByComponentNameAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                                    j,
                                    p.getEndDate());
                    amt = Math.ceil(CalculateEffDate.calculate(p, p.getStartDate(), p.getEndDate(), s,
                            perDaybp, dateTracker,
                            valueTracker, tsc));
                    if (j.equals("HRA")) {
                        p.setHra(amt);
                        grossSal += amt;
                    }
                    if (j.equals("TA")) {
                        p.setTa(amt);
                        grossSal += amt;

                    }
                    if (j.equals("DA")) {
                        p.setDa(amt);
                        grossSal += amt;
                    }
                }

                grossSal += s.getBasicPay();
                p.setGrossSal(grossSal);

                Double netSal = grossSal;
                for (var j : deductions) {

                    Deque<LocalDate> dateTracker = new ArrayDeque<>();
                    Deque<Double> valueTracker = new ArrayDeque<>();
                    dateTracker.push(p.getEndDate());
                    valueTracker.push(0.0d);

                    List<SalaryComponents> tsc = salaryComponentRepository
                            .findByComponentNameAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                                    j,
                                    p.getEndDate());

                    amt = Math.ceil(CalculateEffDate.calculate(p, p.getStartDate(), p.getEndDate(), s,
                            perDaybp, dateTracker,
                            valueTracker, tsc));

                    if (j.equals("PF")) {
                        p.setPf(amt);
                        netSal -= amt;
                    } else if (j.equals("ESI")) {
                        p.setEsi(amt);
                        netSal -= amt;
                    } else if (j.equals("IT")) {
                        p.setIt(amt);
                        netSal -= amt;
                    }
                }
                if (s.getJoiningDate().isAfter(p.getStartDate())
                        && s.getJoiningDate().isBefore(p.getEndDate().plusDays(1))) {
                    netSal = netSal / (ChronoUnit.DAYS.between(p.getStartDate(), p.getEndDate()) + 1.0d);
                    netSal = netSal * (ChronoUnit.DAYS.between(s.getJoiningDate(), p.getEndDate()) + 1.0d);
                    netSal = Math.ceil(netSal);
                }
                p.setNetSal(netSal);

                paySlipRepository.save(p);
            }
        }
        List<PaySlip> pl = paySlipRepository.findAllByStartDateAndEndDate(LocalDate.parse(startDate),
                LocalDate.parse(endDate));
        return pl;
    }

    public List<PaySlip> getApprovedPaySlip() {
        throw new UnsupportedOperationException("Unimplemented method 'getApprovedPaySlip'");
    }

    public List<Double> getLatestRules() {
        LocalDate today = LocalDate.now();

        List<SalaryComponents> sc = salaryComponentRepository.findAll();

        Map<String, Optional<SalaryComponents>> latestByComponent = sc.stream()
                .filter(c -> !c.getEffectiveDate().isAfter(today))
                .collect(Collectors.groupingBy(
                        SalaryComponents::getComponentName,
                        Collectors.maxBy(Comparator.comparing(SalaryComponents::getEffectiveDate))));

        List<Double> percentages = new ArrayList<>();

        percentages.add(latestByComponent.getOrDefault("HRA", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0));
        percentages.add(latestByComponent.getOrDefault("TA", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0));
        percentages.add(latestByComponent.getOrDefault("DA", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0));
        percentages.add(latestByComponent.getOrDefault("PF", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0));
        percentages.add(latestByComponent.getOrDefault("ESI", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0));
        percentages.add(latestByComponent.getOrDefault("IT", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0));

        return percentages;
    }

    public List<PaySlip> getPaySlipByDepartment(String department) {
        return paySlipRepository.findAllByDepartmentAndApproval(department, Approval.Approved);
    }

    public List<PaySlip> getPaySlipByDateAndEmail(String startDate, String endDate, String email) {
        Staff s = staffRepository.findByEmail(email).orElse(null);
        if (s == null) {
            return new ArrayList<>();
        }

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return paySlipRepository.findByStaffIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(
                s.getStaffId(), start, end);
    }

    public Page<PaySlip> getPaySlipByYear(String startDate, String endDate, Pageable pageable) {
        return paySlipRepository.findByStartDateBetweenAndApproval(LocalDate.parse(startDate), LocalDate.parse(endDate),
                pageable, Approval.Approved);
    }

    public Page<PaySlip> getPaySlipByMonth(String startDate, String endDate, Pageable pageable) {
        return paySlipRepository.findByStartDateBetweenAndApproval(LocalDate.parse(startDate), LocalDate.parse(endDate),
                pageable, Approval.Approved);
    }

    public Page<PaySlip> getPaySlipByDepartmentPage(String department, Pageable pageable) {
        return paySlipRepository.findByDepartmentAndApproval(department, pageable, Approval.Approved);
    }

    public Map<String, Double> calculateSalaryComponents() {
        List<Staff> staffList = staffRepository.findAll();

        List<SalaryComponents> sc = salaryComponentRepository.findAll();

        Map<String, Optional<SalaryComponents>> latestByComponent = sc.stream()
                .collect(Collectors.groupingBy(
                        SalaryComponents::getComponentName,
                        Collectors.maxBy(Comparator.comparing(SalaryComponents::getEffectiveDate))));

        double hraPct = latestByComponent.getOrDefault("HRA", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0);
        double daPct = latestByComponent.getOrDefault("DA", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0);
        double taPct = latestByComponent.getOrDefault("TA", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0);
        double pfPct = latestByComponent.getOrDefault("PF", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0);
        double esiPct = latestByComponent.getOrDefault("ESI", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0);
        double itPct = latestByComponent.getOrDefault("IT", Optional.empty())
                .map(SalaryComponents::getPercentage)
                .orElse(0.0);

        double totalBasic = 0;
        double totalHRA = 0;
        double totalDA = 0;
        double totalTA = 0;
        double totalGross = 0;
        double totalPF = 0;
        double totalESI = 0;
        double totalIT = 0;

        for (Staff staff : staffList) {
            double basic = staff.getBasicPay();
            double hra = (hraPct / 100) * basic;
            double da = (daPct / 100) * basic;
            double ta = (taPct / 100) * basic;

            double gross = basic + hra + da + ta;

            double pf = (pfPct / 100) * gross;
            double esi = (esiPct / 100) * gross;
            double it = (itPct / 100) * gross;

            totalBasic += basic;
            totalHRA += hra;
            totalDA += da;
            totalTA += ta;
            totalGross += gross;
            totalPF += pf;
            totalESI += esi;
            totalIT += it;
        }

        Map<String, Double> components = new LinkedHashMap<>();
        components.put("BasicPay", totalBasic);
        components.put("HRA", totalHRA);
        components.put("DA", totalDA);
        components.put("TA", totalTA);
        components.put("GrossSalary", totalGross);
        components.put("PF", totalPF);
        components.put("ESI", totalESI);
        components.put("IT", totalIT);

        return components;
    }

    public Map<String, Double> calculateSalaryComponentsWithDepartment(String department) {
        List<PaySlip> payslips = paySlipRepository.findAllByDepartmentAndApproval(department, Approval.Approved);

        double totalBasic = 0;
        double totalHRA = 0;
        double totalDA = 0;
        double totalTA = 0;
        double totalPF = 0;
        double totalESI = 0;
        double totalIT = 0;

        for (PaySlip pay : payslips) {
            double basic = pay.getBasicPay();
            double hra = pay.getHra();
            double da = pay.getDa();
            double ta = pay.getTa();
            double pf = pay.getPf();
            double esi = pay.getEsi();
            double it = pay.getIt();

            totalBasic += basic;
            totalHRA += hra;
            totalDA += da;
            totalTA += ta;
            totalPF += pf;
            totalESI += esi;
            totalIT += it;
        }
        Map<String, Double> components = new LinkedHashMap<>();
        components.put("BasicPay", totalBasic);
        components.put("HRA", totalHRA);
        components.put("DA", totalDA);
        components.put("TA", totalTA);
        components.put("PF", totalPF);
        components.put("ESI", totalESI);
        components.put("IT", totalIT);

        return components;
    }

    public Map<String, Double> calculateSalaryForMonth(String startDate, String endDate) {
        List<PaySlip> payslips = paySlipRepository.findAllByStartDateBetweenAndApproval(LocalDate.parse(startDate),
                LocalDate.parse(endDate), Approval.Approved);

        double totalBasic = 0;
        double totalHRA = 0;
        double totalDA = 0;
        double totalTA = 0;
        double totalPF = 0;
        double totalESI = 0;
        double totalIT = 0;

        for (PaySlip pay : payslips) {
            double basic = pay.getBasicPay();
            double hra = pay.getHra();
            double da = pay.getDa();
            double ta = pay.getTa();
            double pf = pay.getPf();
            double esi = pay.getEsi();
            double it = pay.getIt();

            totalBasic += basic;
            totalHRA += hra;
            totalDA += da;
            totalTA += ta;
            totalPF += pf;
            totalESI += esi;
            totalIT += it;
        }

        Map<String, Double> components = new LinkedHashMap<>();
        components.put("BasicPay", totalBasic);
        components.put("HRA", totalHRA);
        components.put("DA", totalDA);
        components.put("TA", totalTA);
        components.put("PF", totalPF);
        components.put("ESI", totalESI);
        components.put("IT", totalIT);

        return components;
    }

    public Map<String, Double> calculateSalaryForYear(String startDate, String endDate) {
        return calculateSalaryForMonth(startDate, endDate);
    }

}
