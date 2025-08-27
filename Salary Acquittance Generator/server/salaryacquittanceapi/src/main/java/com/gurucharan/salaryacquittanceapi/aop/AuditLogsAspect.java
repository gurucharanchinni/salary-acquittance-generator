package com.gurucharan.salaryacquittanceapi.aop;

import java.time.LocalTime;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.gurucharan.salaryacquittanceapi.annotation.LoggableAction;
import com.gurucharan.salaryacquittanceapi.model.AuditLogs;
import com.gurucharan.salaryacquittanceapi.model.SalaryComponents;
import com.gurucharan.salaryacquittanceapi.model.Staff;
import com.gurucharan.salaryacquittanceapi.model.Users;
import com.gurucharan.salaryacquittanceapi.repository.AuditLogsRepository;

@Aspect
@Component
public class AuditLogsAspect {
    private AuditLogsRepository auditLogsRepository;

    @Autowired
    public AuditLogsAspect(AuditLogsRepository auditLogsRepository) {
        this.auditLogsRepository = auditLogsRepository;
    }

    @AfterReturning("@annotation(loggableAction)")
    public void logAction(JoinPoint joinPoint, LoggableAction loggableAction) {
        String baseMessage = loggableAction.value();

        Object[] args = joinPoint.getArgs();
        String methodName = joinPoint.getSignature().getName();
        if (methodName.equals("saveStaff")) {
            String staffId = null;
            for (Object arg : args) {
                if (arg instanceof Staff) {
                    Staff staff = (Staff) arg;
                    staffId = staff.getStaffId();
                }
            }
            baseMessage = baseMessage + " " + staffId + " is added by HR";
        } else if (methodName.equals("saveUser")) {
            String username = null, role = "";
            for (Object arg : args) {
                if (arg instanceof Users) {
                    Users user = (Users) arg;
                    username = user.getUsername();
                    role = user.getRole();
                }
            }
            baseMessage = baseMessage + " " + username + " is added as " + role;
        } else if (methodName.equals("saveSalaryComponent")) {
            String componentName = "";
            for (Object arg : args) {
                if (arg instanceof SalaryComponents) {
                    SalaryComponents salaryComponents = (SalaryComponents) arg;
                    componentName = salaryComponents.getComponentName();
                }
            }
            baseMessage = baseMessage + " " + componentName + " is added by ADMIN";
        } else if (methodName.equals("savePaySlip")) {
            baseMessage = baseMessage + " by ACCOUNTS";
        } else if (methodName.equals("changePassword")) {
            String userName = "";
            for (Object arg : args) {
                if (arg instanceof Users) {
                    Users user = (Users) arg;
                    userName = user.getUsername();
                }
            }
            baseMessage = baseMessage + " " + userName;
        } else if (methodName.equals("updateStaff")) {
            String staffId = null;
            for (Object arg : args) {
                if (arg instanceof Staff) {
                    Staff staff = (Staff) arg;
                    staffId = staff.getStaffId();
                }
            }
            baseMessage = "Staff " + staffId + " " + baseMessage + " by HR";
        } else if (methodName.equals("setApproval")) {
            String staffId = null;
            for (Object arg : args) {
                if (arg instanceof Staff) {
                    Staff staff = (Staff) arg;
                    staffId = staff.getStaffId();
                }
            }
            baseMessage = baseMessage + " " + staffId + " by ADMIN";
        }
        AuditLogs auditLogs = new AuditLogs();
        auditLogs.setDescription(baseMessage);
        auditLogs.setCreatedTime(LocalTime.now());
        auditLogsRepository.save(auditLogs);
    }
}
