# Requirements Document

## Introduction

FactoHR is a production-level HR and Employee Management System built on a React.js + Node.js + MongoDB stack. The system replaces the current mock-data frontend with a fully integrated, secure, and role-based platform. It covers six core domains: secure authentication, employee lifecycle management, GPS-based attendance, leave management, attendance regularization, and analytics dashboards. The existing frontend scaffolding (Login, HR Dashboard, Employee Dashboard, Auth Context, Navbar, PunchIn, RequestToHr, HandleEmployee components) will be wired to real backend APIs. The backend will be deployed on Render, the frontend on Vercel, and the database on MongoDB Atlas.

---

## Glossary

- **System**: The FactoHR application as a whole (frontend + backend + database).
- **Auth_Service**: The backend module responsible for authentication and token management.
- **Employee_Service**: The backend module responsible for employee CRUD operations.
- **Attendance_Service**: The backend module responsible for recording and querying attendance records.
- **Leave_Service**: The backend module responsible for leave applications and balance tracking.
- **Regularization_Service**: The backend module responsible for attendance correction requests.
- **Dashboard_Service**: The backend module responsible for aggregating analytics data.
- **API**: The Express.js REST API exposed by the backend.
- **Admin**: A user with the role `admin` (HR manager) who has full system access.
- **Employee**: A user with the role `employee` who has self-service access only.
- **JWT**: JSON Web Token used for stateless authentication.
- **Access_Token**: A short-lived JWT (15 minutes) used to authorize API requests.
- **Refresh_Token**: A long-lived JWT (7 days) stored in an HTTP-only cookie used to renew Access_Tokens.
- **Haversine_Formula**: The spherical-geometry formula used to compute the great-circle distance between two GPS coordinates.
- **Office_Radius**: The maximum allowed distance (100 metres) from the registered office GPS coordinate within which a punch-in is valid.
- **Punch_In**: The action of recording an employee's work-start time and GPS location.
- **Punch_Out**: The action of recording an employee's work-end time.
- **Working_Hours**: The duration in decimal hours between Punch_In and Punch_Out for a given attendance record.
- **Late_Status**: A flag (`on_time` | `late`) set when Punch_In time exceeds the configured office start time (default 09:30).
- **Leave_Balance**: The per-type count of remaining leave days available to an Employee.
- **Regularization_Request**: An Employee's request to correct a missing or incorrect Punch_In / Punch_Out time for a past date.
- **Rate_Limiter**: Express middleware that restricts the number of requests per IP within a time window.
- **Protected_Route**: A React Router route that redirects unauthenticated users to the login page.
- **RBAC**: Role-Based Access Control — restricting API endpoints and UI views based on the user's role.

---

## Requirements

### Requirement 1: Secure Authentication

**User Story:** As a user (Admin or Employee), I want to log in with my email and password so that I can access role-appropriate features securely.

#### Acceptance Criteria

1. WHEN a user submits valid credentials, THE Auth_Service SHALL return an Access_Token (JWT, 15-minute expiry) and set a Refresh_Token in an HTTP-only cookie (7-day expiry).
2. WHEN a user submits an email that does not exist in the database, THE Auth_Service SHALL return HTTP 401 with the message "Invalid credentials".
3. WHEN a user submits an incorrect password, THE Auth_Service SHALL return HTTP 401 with the message "Invalid credentials".
4. THE Auth_Service SHALL hash all passwords using bcrypt with a minimum cost factor of 10 before storing them in the database.
5. WHEN a valid Refresh_Token cookie is present and the Access_Token has expired, THE Auth_Service SHALL issue a new Access_Token without requiring the user to log in again.
6. WHEN a user logs out, THE Auth_Service SHALL invalidate the Refresh_Token cookie and respond with HTTP 200.
7. THE API SHALL reject all requests to protected endpoints that do not carry a valid Access_Token with HTTP 401.
8. THE API SHALL enforce RBAC so that endpoints designated for Admin access return HTTP 403 when accessed by an Employee role.
9. WHEN more than 10 login attempts originate from the same IP address within 15 minutes, THE Rate_Limiter SHALL block further login attempts from that IP and return HTTP 429.
10. THE Auth_Service SHALL read all secrets (JWT secret, bcrypt rounds, token expiry) from environment variables and SHALL NOT hard-code them in source files.
11. WHEN a protected React route is accessed without a valid session, THE System SHALL redirect the user to the login page.
12. WHEN login succeeds, THE System SHALL redirect an Admin to the HR Dashboard and an Employee to the Employee Dashboard.

---

### Requirement 2: Employee Management

**User Story:** As an Admin, I want to create, view, update, and deactivate employee records so that I can maintain an accurate and up-to-date workforce directory.

#### Acceptance Criteria

1. WHEN an Admin submits a valid new-employee form, THE Employee_Service SHALL create a User document with the fields: name, email, hashed password, auto-generated employeeId, role, department, designation, phone, joiningDate, leaveBalance (Casual: 10, Sick: 7, Privilege: 15), officeLocation, and isActive: true.
2. THE Employee_Service SHALL auto-generate a unique employeeId in the format `EMP-YYYYMMDD-XXXX` where XXXX is a zero-padded sequential number per day.
3. WHEN an Admin requests the employee list, THE Employee_Service SHALL return a paginated response with a default page size of 10 records, including totalCount, currentPage, totalPages, and the records array.
4. WHEN an Admin submits a search query, THE Employee_Service SHALL filter employees by name, email, department, or employeeId using a case-insensitive partial match.
5. WHEN an Admin submits an update for an existing employee, THE Employee_Service SHALL validate all fields and persist only the changed fields.
6. WHEN an Admin deactivates an employee, THE Employee_Service SHALL set isActive to false and SHALL NOT delete the record from the database.
7. IF a new-employee form is submitted with an email that already exists, THEN THE Employee_Service SHALL return HTTP 409 with the message "Email already registered".
8. IF a required field (name, email, department, designation, joiningDate) is missing from the employee creation request, THEN THE Employee_Service SHALL return HTTP 400 with a field-level validation error message.
9. THE Employee_Service SHALL validate that the phone field, when provided, matches the E.164 format (e.g., +911234567890).
10. WHILE an employee's isActive flag is false, THE System SHALL prevent that employee from logging in and SHALL return HTTP 403 with the message "Account deactivated. Contact HR."

---

### Requirement 3: GPS-Based Attendance

**User Story:** As an Employee, I want to punch in and out using my device's GPS so that my attendance is recorded accurately and only when I am physically present at the office.

#### Acceptance Criteria

1. WHEN an Employee initiates a Punch_In, THE Attendance_Service SHALL request the device's GPS coordinates via the browser Geolocation API.
2. WHEN GPS coordinates are obtained, THE Attendance_Service SHALL compute the distance between the Employee's coordinates and the stored officeLocation using the Haversine_Formula.
3. IF the computed distance exceeds the Office_Radius (100 metres), THEN THE Attendance_Service SHALL reject the Punch_In and return HTTP 403 with the message "You are outside the office premises."
4. WHEN a valid Punch_In is recorded, THE Attendance_Service SHALL create an Attendance document with: employee reference, punchInTime (UTC ISO-8601), date (YYYY-MM-DD in local timezone), status: "present", location (latitude and longitude), and lateStatus computed against the configured office start time.
5. IF an Attendance document already exists for the Employee on the current date with a punchInTime set, THEN THE Attendance_Service SHALL reject a second Punch_In attempt and return HTTP 409 with the message "Already punched in for today."
6. WHEN an Employee initiates a Punch_Out, THE Attendance_Service SHALL update the existing Attendance document with punchOutTime (UTC ISO-8601) and compute Working_Hours as the decimal difference between punchOutTime and punchInTime, rounded to two decimal places.
7. IF an Employee attempts to Punch_Out without a prior Punch_In on the current date, THEN THE Attendance_Service SHALL return HTTP 400 with the message "No active punch-in found for today."
8. THE Attendance_Service SHALL expose a paginated attendance history endpoint for Employees that returns records sorted by date descending, with fields: date, punchInTime, punchOutTime, workingHours, status, lateStatus.
9. THE Attendance_Service SHALL expose an attendance overview endpoint for Admins that accepts employeeId, month, and year query parameters and returns all attendance records for that employee in the specified period.
10. WHEN the browser Geolocation API returns an error or permission is denied, THE System SHALL display a user-facing error message "Location access is required to punch in. Please enable GPS." and SHALL NOT submit the punch request.

---

### Requirement 4: Leave Management

**User Story:** As an Employee, I want to apply for leave and track my leave balance, and as an Admin, I want to approve or reject leave requests so that absences are managed transparently.

#### Acceptance Criteria

1. WHEN an Employee submits a leave application with leaveType, startDate, endDate, and reason, THE Leave_Service SHALL create a Leave document with status: "pending".
2. THE Leave_Service SHALL support three leave types: "casual", "sick", and "privilege".
3. WHEN a leave application is submitted, THE Leave_Service SHALL compute the number of requested leave days (excluding weekends) and validate that the Employee's Leave_Balance for the requested type is sufficient.
4. IF the Employee's Leave_Balance for the requested leave type is insufficient, THEN THE Leave_Service SHALL return HTTP 400 with the message "Insufficient leave balance for [leaveType]."
5. IF the startDate is in the past relative to the current date, THEN THE Leave_Service SHALL return HTTP 400 with the message "Leave start date cannot be in the past."
6. IF an Employee already has an approved or pending leave application that overlaps with the requested date range, THEN THE Leave_Service SHALL return HTTP 409 with the message "Overlapping leave request exists."
7. WHEN an Admin approves a leave application, THE Leave_Service SHALL update the Leave document status to "approved" and deduct the approved leave days from the Employee's Leave_Balance.
8. WHEN an Admin rejects a leave application, THE Leave_Service SHALL update the Leave document status to "rejected" and persist the Admin's remarks field.
9. THE Leave_Service SHALL expose an endpoint for Employees to retrieve their own leave history, paginated and sorted by application date descending.
10. THE Leave_Service SHALL expose an endpoint for Admins to retrieve all pending leave applications across all employees, with filters for leaveType and department.
11. WHEN an Employee views the leave application form, THE System SHALL display the current Leave_Balance for each leave type fetched from the API.

---

### Requirement 5: Attendance Regularization

**User Story:** As an Employee, I want to submit a correction request for a missing or incorrect punch time, and as an Admin, I want to review and apply approved corrections so that attendance records remain accurate.

#### Acceptance Criteria

1. WHEN an Employee submits a Regularization_Request with attendanceDate, correctedPunchInTime, correctedPunchOutTime, and reason, THE Regularization_Service SHALL create a Regularization document with status: "pending".
2. IF a Regularization_Request is submitted for a date that has no existing Attendance document for that Employee, THEN THE Regularization_Service SHALL create a placeholder Attendance document with status: "regularization_pending" alongside the Regularization document.
3. IF an Employee already has a pending Regularization_Request for the same attendanceDate, THEN THE Regularization_Service SHALL return HTTP 409 with the message "A pending regularization request already exists for this date."
4. WHEN an Admin approves a Regularization_Request, THE Regularization_Service SHALL update the corresponding Attendance document with the corrected punchInTime and punchOutTime, recompute Working_Hours, and set the Regularization document status to "approved".
5. WHEN an Admin rejects a Regularization_Request, THE Regularization_Service SHALL update the Regularization document status to "rejected" and persist the Admin's remarks.
6. THE Regularization_Service SHALL expose an endpoint for Employees to view their own regularization history, sorted by request date descending.
7. THE Regularization_Service SHALL expose an endpoint for Admins to view all pending regularization requests, with filters for department and date range.
8. WHEN an Admin views the pending requests panel, THE System SHALL display both pending Leave requests and pending Regularization requests in a unified list, each tagged with its type ("Leave" or "Punch").

---

### Requirement 6: Dashboard and Analytics

**User Story:** As an Admin, I want an overview of workforce attendance and leave metrics, and as an Employee, I want a self-service view of my own attendance and leave status, so that both parties can make informed decisions.

#### Acceptance Criteria

1. WHEN an Admin loads the HR Dashboard, THE Dashboard_Service SHALL return: total employee count, present-today count, on-leave-today count, pending-requests count (leave + regularization combined), and department-wise headcount.
2. WHEN an Admin loads the HR Dashboard, THE Dashboard_Service SHALL return monthly attendance data (present days vs absent days per week) for the current month, suitable for rendering a bar or line chart.
3. WHEN an Employee loads the Employee Dashboard, THE Dashboard_Service SHALL return: the Employee's attendance summary for the current month (present days, absent days, late days, working hours total), current Leave_Balance per type, and the status of the most recent leave and regularization requests.
4. THE System SHALL render all chart data using a charting library (Recharts or Chart.js) integrated into the React frontend.
5. WHEN an Admin views the employee list on the HR Dashboard, THE System SHALL display a paginated table with columns: employeeId, name, department, designation, status (active/inactive), and an actions menu.
6. WHEN an Employee views the punch history table on the Employee Dashboard, THE System SHALL display records with columns: date, punchIn time, punchOut time, working hours, and status badge (Present / Late / Half Day / Absent).
7. THE Dashboard_Service SHALL cache Admin-level aggregate metrics for 60 seconds to reduce database load, using an in-memory cache (e.g., node-cache).

---

### Requirement 7: API Security and Infrastructure

**User Story:** As a system operator, I want the API to be hardened against common attacks and configured for production deployment so that the system is reliable and secure.

#### Acceptance Criteria

1. THE API SHALL apply the `helmet` middleware to set secure HTTP response headers on all responses.
2. THE API SHALL apply a global Rate_Limiter of 100 requests per IP per 15-minute window across all endpoints, in addition to the stricter login-specific limiter defined in Requirement 1.
3. THE API SHALL enable CORS restricted to the Vercel frontend origin, configurable via an environment variable.
4. THE API SHALL validate all incoming request bodies using a schema validation library (express-validator or Joi) and return HTTP 400 with structured field-level errors for any validation failure.
5. THE API SHALL use MongoDB transactions for operations that modify multiple documents atomically (e.g., leave approval that updates both the Leave document and the User's leaveBalance).
6. THE System SHALL store all sensitive configuration (MongoDB URI, JWT secret, bcrypt rounds, office GPS coordinates, allowed CORS origin) in environment variables and SHALL NOT commit these values to source control.
7. IF the MongoDB connection is unavailable at startup, THEN THE API SHALL log the error and exit the process with a non-zero exit code.
8. THE API SHALL log all HTTP requests (method, path, status code, response time) using the `morgan` middleware in production mode.
9. THE System SHALL expose a health-check endpoint at `GET /api/health` that returns HTTP 200 with `{ status: "ok", timestamp: <ISO-8601> }` when the service is running.
10. THE API SHALL use Mongoose schema-level validation as a second layer of defence in addition to request-body validation middleware.
