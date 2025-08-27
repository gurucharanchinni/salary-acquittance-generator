package com.gurucharan.salaryacquittanceapi.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.PaySlip;
import com.gurucharan.salaryacquittanceapi.service.PaySlipService;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/payslip")
public class PaySlipController {
    private final PaySlipService paySlipService;

    @Autowired
    public PaySlipController(PaySlipService paySlipService) {
        this.paySlipService = paySlipService;
    }

    @GetMapping
    public List<PaySlip> getAllPaySlip() {
        return paySlipService.getAllPaySlip();
    }

    @GetMapping("/page")
    public ResponseEntity<Page<PaySlip>> getAllPaySlip(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PaySlip> paySlips = paySlipService.getApprovedPaySlip(pageable);

        return ResponseEntity.ok(paySlips);
    }

    @PostMapping("/generate")
    public List<PaySlip> generatePaySlip(@RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        return paySlipService.savePaySlip(startDate, endDate);

    }

    @PostMapping("/yearwise")
    public List<PaySlip> yearWise(@RequestParam("year") String year) {
        String startDate = year + "-01-01";
        String endDate = year + "-12-31";
        return paySlipService.getPaySlipByDate(startDate, endDate);
    }

    @PostMapping("/yearwisepage")
    public ResponseEntity<Page<PaySlip>> yearWisePage(@RequestParam("year") int year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        String startDate = year + "-01-01";
        String endDate = year + "-12-31";
        Page<PaySlip> paySlips = paySlipService.getPaySlipByYear(startDate, endDate, pageable);

        return ResponseEntity.ok(paySlips);
    }

    @PostMapping("/monthwise")
    public List<PaySlip> monthWise(@RequestParam("month") String month, @RequestParam("year") int year) {
        int monthNum = LocalDate.parse(month + " 1, 2000",
                DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH))
                .getMonthValue();

        // Get first and last day of the month
        YearMonth yearMonth = YearMonth.of(year, monthNum);
        String startDate = yearMonth.atDay(1).toString(); // yyyy-MM-dd
        String endDate = yearMonth.atEndOfMonth().toString(); // yyyy-MM-dd

        return paySlipService.getPaySlipByDate(startDate, endDate);
    }

    @PostMapping("/monthwisepage")
    public ResponseEntity<Page<PaySlip>> monthWisePage(@RequestParam("month") String month,
            @RequestParam("year") int year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        int monthNum = LocalDate.parse(month + " 1, 2000",
                DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH))
                .getMonthValue();

        // Get first and last day of the month
        YearMonth yearMonth = YearMonth.of(year, monthNum);
        String startDate = yearMonth.atDay(1).toString(); // yyyy-MM-dd
        String endDate = yearMonth.atEndOfMonth().toString(); // yyyy-MM-dd

        Page<PaySlip> paySlips = paySlipService.getPaySlipByMonth(startDate, endDate, pageable);

        return ResponseEntity.ok(paySlips);
    }

    @PostMapping("/getpayslip")
    public ResponseEntity<List<PaySlip>> getPaySlipByUserName(@RequestParam("email") String email) {
        return ResponseEntity.ok(paySlipService.getPaySlipsByEmail(email));
    }

    @PostMapping("/getmonthwise")
    public ResponseEntity<List<PaySlip>> getPaySlipMonthWiseAndEmail(@RequestParam("month") String month,
            @RequestParam("year") int year, @RequestParam("email") String email) {

        int monthNum = LocalDate.parse(month + " 1, 2000",
                DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH))
                .getMonthValue();

        // Get first and last day of the month
        YearMonth yearMonth = YearMonth.of(year, monthNum);
        String startDate = yearMonth.atDay(1).toString(); // yyyy-MM-dd
        String endDate = yearMonth.atEndOfMonth().toString(); // yyyy-MM-dd

        return ResponseEntity.ok(paySlipService.getPaySlipByDateAndEmail(startDate, endDate, email));
    }

    @GetMapping("/getapproved")
    public List<PaySlip> getApprovedPaySlip() {
        return paySlipService.getApprovedPaySlip();
    }

    @GetMapping("/getrejected")
    public List<PaySlip> getNotApprovedPaySlip() {
        return paySlipService.getNotApprovalPaySlip();
    }

    @PostMapping("/setapproval")
    public ResponseEntity<String> setApproval(@RequestParam("id") String staffId) {
        return ResponseEntity.ok(paySlipService.setApproval(staffId));
    }

    @PostMapping("/department")
    public ResponseEntity<List<PaySlip>> getPaySlipByDepartment(@RequestParam("department") String department) {
        return ResponseEntity.ok(paySlipService.getPaySlipByDepartment(department));
    }

    @PostMapping("/departmentpage")
    public ResponseEntity<Page<PaySlip>> getPaySlipByDepartmentPage(@RequestParam("department") String department,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(paySlipService.getPaySlipByDepartmentPage(department, pageable));
    }

    @GetMapping("/latestRules")
    public ResponseEntity<List<Double>> getLatestRules() {
        return ResponseEntity.ok(paySlipService.getLatestRules());
    }

    @GetMapping("/calculateSalary")
    public ResponseEntity<Map<String, Double>> calculateSalary() {
        return ResponseEntity.ok(paySlipService.calculateSalaryComponents());
    }

    @PostMapping("/calculateSalaryDepartment")
    public ResponseEntity<Map<String, Double>> calculateSalaryByDepartment(
            @RequestParam("department") String department) {
        return ResponseEntity.ok(paySlipService.calculateSalaryComponentsWithDepartment(department));
    }

    @PostMapping("/calculateSalaryMonth")
    public ResponseEntity<Map<String, Double>> calculateSalaryByMonth(@RequestParam("month") String month,
            @RequestParam("year") int year) {

        int monthNum = LocalDate.parse(month + " 1, 2000",
                DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH))
                .getMonthValue();

        // Get first and last day of the month
        YearMonth yearMonth = YearMonth.of(year, monthNum);
        String startDate = yearMonth.atDay(1).toString(); // yyyy-MM-dd
        String endDate = yearMonth.atEndOfMonth().toString(); // yyyy-MM-dd

        return ResponseEntity.ok(paySlipService.calculateSalaryForMonth(startDate, endDate));
    }

    @PostMapping("/calculateSalaryYear")
    public ResponseEntity<Map<String, Double>> calculatesalaryByYear(@RequestParam("year") int year) {

        return ResponseEntity.ok(paySlipService.calculateSalaryForYear(year + "-01-01", year + "-12-31"));
    }
}
