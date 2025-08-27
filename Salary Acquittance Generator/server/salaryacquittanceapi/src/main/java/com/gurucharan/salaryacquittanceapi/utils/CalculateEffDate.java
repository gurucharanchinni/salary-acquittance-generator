package com.gurucharan.salaryacquittanceapi.utils;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Deque;
import java.util.List;

import com.gurucharan.salaryacquittanceapi.model.PaySlip;
import com.gurucharan.salaryacquittanceapi.model.SalaryComponents;
import com.gurucharan.salaryacquittanceapi.model.Staff;

public class CalculateEffDate {
    public static Double calculate(PaySlip p, LocalDate startDate, LocalDate endDate, Staff s, Double perDaybp,
            Deque<LocalDate> dateTracker, Deque<Double> valueTracker, List<SalaryComponents> tsc) {
        for (var e : tsc) {
            dateTracker.push(e.getEffectiveDate());
            valueTracker.push(e.getPercentage());
            if (e.getEffectiveDate().isBefore(p.getStartDate())) {
                break;
            }
        }

        Double amt = 0.0d;
        LocalDate st = startDate;
        while (!dateTracker.isEmpty()) {
            LocalDate d = dateTracker.pop();
            Double val = valueTracker.pop();
            if (dateTracker.isEmpty()) {
                break;
            }
            LocalDate ed = dateTracker.peek();
            if (!ed.isEqual(p.getEndDate())) {
                amt += ((ChronoUnit.DAYS.between(st, ed)) * perDaybp) * (val / 100.0d);
            } else {
                amt += ((ChronoUnit.DAYS.between(st, ed) + 1) * perDaybp) * (val / 100.0d);
            }
            st = ed;
        }
        return amt;
    }
}
