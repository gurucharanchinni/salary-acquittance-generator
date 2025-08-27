package com.gurucharan.salaryacquittanceapi.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.gurucharan.salaryacquittanceapi.annotation.LoggableAction;
import com.gurucharan.salaryacquittanceapi.model.SalaryList;
import com.gurucharan.salaryacquittanceapi.model.Staff;
import com.gurucharan.salaryacquittanceapi.model.Users;
import com.gurucharan.salaryacquittanceapi.repository.StaffRepository;
import com.gurucharan.salaryacquittanceapi.repository.UsersRepository;
import com.gurucharan.salaryacquittanceapi.utils.Status;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public StaffService(StaffRepository staffRepository, UsersRepository usersRepository) {
        this.staffRepository = staffRepository;
        this.usersRepository = usersRepository;
    }

    public Staff getStaffByStaffName(String staffName) {
        return staffRepository.findByStaffName(staffName);
    }

    public Staff findByStaffId(String staffId) {
        return staffRepository.findByStaffId(staffId);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll(Sort.by(Sort.Direction.ASC, "staffId"));
    }

    public List<Staff> getAllStaffAfter(LocalDate date) {
        return staffRepository.findAllByJoiningDateAfter(date);
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id).orElse(new Staff());
    }

    public String getEmailByUsername(String username) {
        System.out.println(username);
        Users user = usersRepository.findByUsername(username);
        return user.getEmail();
    }

    @LoggableAction(value = "New Staff")
    public void saveStaff(Staff staff) {
        Long maxId = staffRepository.findMaxId();
        if (maxId == null) {
            maxId = 0L;
        }
        staff.setId(maxId + 1);
        if (staff.getStatusEffectiveDates() == null) {
            staff.setStatus(Status.ACTIVE);
        } else {
            staff.setStatus(Status.RELIEVED);
        }
        SalaryList newList = new SalaryList();
        newList.setStaff(staff);
        staff.setSalaryList(newList);
        staffRepository.save(staff);
    }

    @LoggableAction("details updated")
    public String updateStaff(Staff staff) {
        Staff dbStaff = staffRepository.findByStaffId(staff.getStaffId());
        staff.setId(dbStaff.getId());
        if (staff.getStatusEffectiveDates() == null) {
            staff.setStatus(Status.ACTIVE);
        } else {
            staff.setStatus(Status.RELIEVED);
        }
        staffRepository.save(staff);
        return "Success";
    }

    public Staff getStaffById(String staffId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getStaffById'");
    }

    public String findByEmail(String email) {
        Staff s = staffRepository.findByEmail(email).orElse(null);
        if (s == null) {
            return "Not Found";
        }
        return "Found";
    }
}
