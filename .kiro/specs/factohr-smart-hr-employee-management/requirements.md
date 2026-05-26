# Requirements Document

## Introduction

FactoHR is a production-level Smart HR & Employee Management System built on the MERN stack (MongoDB, Express.js, React.js, Node.js). The system replaces the current frontend-only prototype — which uses hardcoded credentials, mock data, and an empty AuthProvider — with a fully functional, API-driven application.

The system supports two roles: **Admin (HR)** and **Employee**. HR users manage the workforce, approve requests, and view analytics. Employees punch in/out via GPS, apply for leave, submit attendance corrections, and view their own records.

The frontend is deployed on Vercel, the backend on Render, and the database on MongoDB Atlas. The UI follows a dark theme (slate-950 background) with yellow/amber accents and glassmorphism card styling.

---

## Glossary

- **System**: The FactoHR application as a whole (frontend + backend).
- **Auth_Service**: The backend module responsible for authentication and token management.
- **Employee_Service**: The backend module responsible for employee CRUD operations.
- **Attendance_Service**: The backend module responsible for punch-in/out and attendance records.
- **Leave_Service**: The backend module responsible for leave applications and balance tracking.
- **Regularization_Service**: The backend module responsible for attendance correction requests.
- **Report_Service**: The backend module responsible for generating filtered attendance and leave reports.
- **Dashboard_Service**: The backend module responsible for aggregating analytics data.
- **JWT**: JSON Web Token — a signed, stateless token used to authenticate API requests.
- **Admin**: A user with the role `admin`, representing an HR manager with full system access.
- **Employee**: A user with the role `employee`, with access limited to their own records.
- **Punch_In**: The action of recording an employee's work start time and GPS location.
- **Punch_Out**: The action of recording an employee's work end time.
- **Office_Location**: A GPS coordinate (latitude, longitude) stored per employee representing their assigned office.
- **Haversine_Distance**: The great-circle distance in metres between two GPS coordinates, calculated using the Haversine formula.
- **Leave_Balance**: The count of remaining approved leave days per leave type (Casual, Sick, Privilege) for an employee.
- **Regularization**: An employee's request to correct a missing or incorrect punch-in/out record.
- **Working_Hours**: The duration in decimal hours between Punch_In time and Punch_Out time for a given attendance record.
- **Protected_Route**: A frontend route that requires a valid JWT to access; unauthenticated users are redirected to `/login`.
- **RBAC**: Role-Based Access Control — restricting API endpoints and UI routes based on the user's role.

---

## Requirements

### Requirement 1: JWT Authentication

**User Story:** As a user (Admin or Employee), I want to log in with my email and password, so that I can securely access the system with the correct role-based permissions.

#### Acceptance Criteria

1. WHEN a user submits a valid email and password, THE Auth_Service SHALL return a signed JWT containing the user's `id`, `role`, `name`, and `employeeId`.
2. WHEN a user submits an invalid email or incorrect password, THE Auth_Service SHALL return an HTTP 401 response with a descriptive error message.
3. THE Auth_Service SHALL hash all passwords using bcrypt with a minimum cost factor of 10 before storing them in the database.
4. WHEN a user successfully logs in, THE System SHALL store the JWT in `localStorage` under the key `factohr_token`.
5. WHEN a user logs out, THE System SHALL remove the JWT from `localStorage` and redirect the user to `/login`.
6. WHILE a valid JWT is present in `localStorage`, THE System SHALL automatically attach it as a `Bearer` token in the `Authorization` header of every API request.
7. IF a JWT is expired or has an invalid signature, THEN THE Auth_Service SHALL return an HTTP 401 response and THE System SHALL redirect the user to `/login`.
8. THE Auth_Service SHALL accept JWT expiry configuration via an environment variable `JWT_EXPIRES_IN`.

---

### Requirement 2: Role-Based Access Control (RBAC)

**User Story:** As a system administrator, I want API endpoints and frontend routes to be protected by role, so that employees cannot access HR-only features and vice versa.

#### Acceptance Criteria

1. THE System SHALL enforce two roles: `admin` and `employee`.
2. WHEN an unauthenticated user navigates to any Protected_Route, THE System SHALL redirect the user to `/login`.
3. WHEN an authenticated user with role `employee` attempts to access an Admin-only API endpoint, THE Auth_Service SHALL return an HTTP 403 response.
4. WHEN an authenticated user with role `admin` attempts to access an Employee-only API endpoint, THE Auth_Service SHALL return an HTTP 403 response.
5. THE System SHALL render the HR Dashboard layout for users with role `admin` and the Employee Dashboard layout for users with role `employee` after successful login.
6. THE System SHALL implement Protected_Routes using React Router v7 that verify the JWT from `localStorage` before rendering any authenticated page.

---

### Requirement 3: Employee Management

**User Story:** As an Admin, I want to create, view, edit, and deactivate employee records, so that I can maintain an accurate and up-to-date workforce directory.

#### Acceptance Criteria

1. WHEN an Admin submits a valid new employee form, THE Employee_Service SHALL create a User document with fields: `name`, `email`, `password` (auto-generated, hashed), `employeeId` (auto-generated), `role` (default `employee`), `department`, `designation`, `phone`, `joiningDate`, `leaveBalance` (default: Casual 10, Sick 7, Privilege 15), `officeLocation`, and `isActive` (default `true`).
2. WHEN an Admin requests the employee list, THE Employee_Service SHALL return a paginated response with a configurable `pageSize` (default 10) and the total employee count.
3. WHEN an Admin submits an edit form for an existing employee, THE Employee_Service SHALL update only the provided fields and return the updated document.
4. WHEN an Admin deactivates an employee, THE Employee_Service SHALL set `isActive` to `false` and THE System SHALL prevent that employee from logging in.
5. IF an Admin attempts to create an employee with an email that already exists, THEN THE Employee_Service SHALL return an HTTP 409 response with the message "Email already registered".
6. THE Employee_Service SHALL validate that `email` is a valid email format, `phone` matches a 10–15 digit pattern, and `joiningDate` is not a future date before creating or updating a record.
7. WHEN an Admin searches employees by name, department, or designation, THE Employee_Service SHALL return all matching records filtered case-insensitively.

---

### Requirement 4: GPS-Based Attendance — Punch In

**User Story:** As an Employee, I want to punch in from my mobile or browser, so that my attendance is recorded only when I am physically within the office premises.

#### Acceptance Criteria

1. WHEN an Employee initiates a Punch_In, THE System SHALL request the browser Geolocation API for the employee's current coordinates.
2. WHEN the employee's coordinates are obtained, THE Attendance_Service SHALL compute the Haversine_Distance between the employee's coordinates and the employee's stored Office_Location.
3. IF the Haversine_Distance is greater than 100 metres, THEN THE Attendance_Service SHALL reject the Punch_In and return an HTTP 400 response with the message "You are outside the office radius".
4. IF an Attendance record with the same `employee` and `date` already has a `punchInTime`, THEN THE Attendance_Service SHALL reject the duplicate Punch_In and return an HTTP 409 response with the message "Already punched in for today".
5. WHEN a valid Punch_In is accepted, THE Attendance_Service SHALL create an Attendance document with `punchInTime`, `date`, `location` (coordinates), and `status` set to `Present`.
6. IF the Punch_In time is after 09:30 AM, THEN THE Attendance_Service SHALL set `lateStatus` to `Late` on the Attendance document.
7. IF the browser Geolocation API is unavailable or the user denies permission, THEN THE System SHALL display an error message "Location access is required to punch in" and SHALL NOT submit the punch request.

---

### Requirement 5: GPS-Based Attendance — Punch Out

**User Story:** As an Employee, I want to punch out at the end of my workday, so that my working hours are accurately recorded.

#### Acceptance Criteria

1. WHEN an Employee initiates a Punch_Out, THE Attendance_Service SHALL locate the existing Attendance document for the employee on the current date.
2. IF no Punch_In record exists for the current date, THEN THE Attendance_Service SHALL return an HTTP 400 response with the message "No punch-in record found for today".
3. IF a `punchOutTime` already exists on the current date's Attendance document, THEN THE Attendance_Service SHALL return an HTTP 409 response with the message "Already punched out for today".
4. WHEN a valid Punch_Out is accepted, THE Attendance_Service SHALL update the Attendance document with `punchOutTime` and SHALL calculate `workingHours` as the difference in decimal hours between `punchOutTime` and `punchInTime`.
5. THE Attendance_Service SHALL ensure `workingHours` is always a non-negative value.
6. IF `workingHours` is less than 4, THEN THE Attendance_Service SHALL set `status` to `Half Day` on the Attendance document.

---

### Requirement 6: Leave Management — Employee

**User Story:** As an Employee, I want to apply for leave and track my leave balance, so that I can manage my time off transparently.

#### Acceptance Criteria

1. WHEN an Employee submits a leave application with `leaveType`, `startDate`, `endDate`, and `reason`, THE Leave_Service SHALL create a Leave document with `status` set to `Pending`.
2. THE Leave_Service SHALL validate that `startDate` is not before the current date and `endDate` is not before `startDate`.
3. IF the number of requested leave days exceeds the employee's available Leave_Balance for the selected `leaveType`, THEN THE Leave_Service SHALL return an HTTP 400 response with the message "Insufficient leave balance".
4. WHEN an Employee views their leave history, THE Leave_Service SHALL return all Leave documents for that employee sorted by `startDate` descending.
5. THE System SHALL display the employee's current Leave_Balance for each leave type (Casual, Sick, Privilege) on the Employee Dashboard.
6. WHEN an Employee cancels a Pending leave application, THE Leave_Service SHALL set the Leave document `status` to `Cancelled` without modifying the Leave_Balance.

---

### Requirement 7: Leave Management — HR Approval

**User Story:** As an Admin, I want to approve or reject employee leave requests, so that I can manage team availability effectively.

#### Acceptance Criteria

1. WHEN an Admin approves a leave request, THE Leave_Service SHALL set the Leave document `status` to `Approved` and SHALL deduct the leave duration in days from the employee's Leave_Balance for the corresponding `leaveType`.
2. WHEN an Admin rejects a leave request, THE Leave_Service SHALL set the Leave document `status` to `Rejected` and SHALL store the Admin's `remarks` on the Leave document.
3. IF an Admin attempts to approve a leave request that is not in `Pending` status, THEN THE Leave_Service SHALL return an HTTP 400 response with the message "Only pending requests can be approved".
4. THE Leave_Service SHALL ensure the employee's Leave_Balance for any leave type never falls below zero after an approval.
5. WHEN an Admin views pending leave requests, THE Leave_Service SHALL return all Leave documents with `status` equal to `Pending`, sorted by `startDate` ascending.

---

### Requirement 8: Attendance Regularization

**User Story:** As an Employee, I want to submit a correction request for a missing or incorrect punch record, so that my attendance history accurately reflects my actual working hours.

#### Acceptance Criteria

1. WHEN an Employee submits a regularization request with `attendanceDate`, `reason`, and the corrected `punchInTime` and `punchOutTime`, THE Regularization_Service SHALL create a Regularization document with `status` set to `Pending`.
2. THE Regularization_Service SHALL validate that `attendanceDate` is not a future date.
3. IF a Regularization document with the same `employee` and `attendanceDate` already has `status` equal to `Pending`, THEN THE Regularization_Service SHALL return an HTTP 409 response with the message "A pending regularization request already exists for this date".
4. WHEN an Admin approves a regularization request, THE Regularization_Service SHALL update the corresponding Attendance document with the corrected `punchInTime`, `punchOutTime`, and recalculated `workingHours`, and SHALL set the Regularization document `status` to `Approved`.
5. WHEN an Admin rejects a regularization request, THE Regularization_Service SHALL set the Regularization document `status` to `Rejected` and SHALL store the Admin's `remarks`.
6. WHEN an Admin views pending regularization requests, THE Regularization_Service SHALL return all Regularization documents with `status` equal to `Pending`.

---

### Requirement 9: Admin Dashboard Analytics

**User Story:** As an Admin, I want a real-time analytics dashboard, so that I can monitor workforce attendance and leave status at a glance.

#### Acceptance Criteria

1. WHEN an Admin loads the HR Dashboard, THE Dashboard_Service SHALL return the total count of active employees.
2. WHEN an Admin loads the HR Dashboard, THE Dashboard_Service SHALL return today's attendance summary: count of employees who are Present, Absent, Late, and on Leave.
3. THE Dashboard_Service SHALL ensure the sum of Present, Absent, Late, and on-Leave counts equals the total active employee count for the current date.
4. WHEN an Admin loads the HR Dashboard, THE Dashboard_Service SHALL return the count of pending leave requests and pending regularization requests.
5. THE Dashboard_Service SHALL return all analytics data in a single API response to minimise round trips.

---

### Requirement 10: Employee Dashboard

**User Story:** As an Employee, I want a personalised dashboard showing my punch status, leave balance, and recent attendance, so that I can stay informed about my own HR data.

#### Acceptance Criteria

1. WHEN an Employee loads the Employee Dashboard, THE Dashboard_Service SHALL return the employee's current punch status for today (`Punched In`, `Punched Out`, or `Not Punched`).
2. WHEN an Employee loads the Employee Dashboard, THE Dashboard_Service SHALL return the employee's Leave_Balance for all three leave types.
3. WHEN an Employee loads the Employee Dashboard, THE Dashboard_Service SHALL return the employee's last 7 attendance records sorted by date descending.
4. THE System SHALL display the employee's profile information (name, department, designation, employeeId) on the Employee Dashboard.
5. WHEN an Employee updates their phone number or address via the profile edit form, THE Employee_Service SHALL update only those fields on the User document.

---

### Requirement 11: Attendance & Leave Reports

**User Story:** As an Admin, I want to generate filtered attendance and leave reports, so that I can audit workforce data and support payroll processing.

#### Acceptance Criteria

1. WHEN an Admin requests an attendance report with a `startDate` and `endDate` filter, THE Report_Service SHALL return all Attendance documents where `date` falls within the inclusive range `[startDate, endDate]`.
2. WHEN an Admin applies an employee filter to an attendance report, THE Report_Service SHALL return only Attendance documents belonging to the specified employee.
3. WHEN an Admin applies a status filter (`Present`, `Absent`, `Late`, `Half Day`) to an attendance report, THE Report_Service SHALL return only Attendance documents matching the specified status.
4. THE Report_Service SHALL ensure that applying a stricter date range filter returns a subset of the results from a broader date range filter for the same employee.
5. WHEN an Admin requests a leave report, THE Report_Service SHALL return all Leave documents filterable by `leaveType`, `status`, and date range.
6. THE Report_Service SHALL return report data in a paginated format with a configurable `pageSize`.

---

### Requirement 12: Security & Data Integrity

**User Story:** As a system owner, I want all sensitive data protected and all inputs validated, so that the system is secure and resistant to common attacks.

#### Acceptance Criteria

1. THE Auth_Service SHALL store all JWT secrets, database connection strings, and bcrypt salt rounds in environment variables and SHALL NOT hardcode any secrets in source code.
2. THE System SHALL validate all incoming API request bodies using a schema validation library (e.g., Joi or express-validator) before processing.
3. IF a required field is missing or fails validation, THEN THE System SHALL return an HTTP 422 response with a structured error object listing each invalid field and its error message.
4. THE System SHALL apply rate limiting of 100 requests per 15-minute window per IP address on all authentication endpoints.
5. THE System SHALL set `httpOnly` and `Secure` flags on any cookies used, and SHALL use CORS configuration to allow requests only from the configured frontend origin.
6. THE Employee_Service SHALL prevent an Admin from deleting their own account.
7. THE Attendance_Service SHALL prevent any modification of an Attendance document's `punchInTime` after it has been set, except through an approved Regularization request.

---

### Requirement 13: Working Hours Calculation (Pure Function)

**User Story:** As a system owner, I want working hours to be calculated accurately and consistently, so that payroll and attendance reports are reliable.

#### Acceptance Criteria

1. THE Attendance_Service SHALL calculate `workingHours` using the formula: `(punchOutTime - punchInTime)` expressed in decimal hours, rounded to two decimal places.
2. FOR ALL valid Attendance records where `punchOutTime` is after `punchInTime`, THE Attendance_Service SHALL produce a `workingHours` value greater than or equal to 0.
3. FOR ALL valid Attendance records, recalculating `workingHours` from the stored `punchInTime` and `punchOutTime` SHALL produce the same value as the originally stored `workingHours` (idempotence).
4. THE Attendance_Service SHALL expose the working hours calculation as a pure utility function with no side effects, accepting `punchInTime` and `punchOutTime` as inputs and returning a numeric value.

---

### Requirement 14: Frontend Architecture & Routing

**User Story:** As a developer, I want a well-structured frontend with proper routing and state management, so that the application is maintainable and scalable.

#### Acceptance Criteria

1. THE System SHALL implement React Router v7 with the following route structure: `/login` (public), `/admin/*` (Admin-only Protected_Routes), `/employee/*` (Employee-only Protected_Routes).
2. THE System SHALL implement the `AuthProvider` context to expose `user`, `token`, `login()`, and `logout()` functions to all child components.
3. WHEN the application loads, THE System SHALL read the JWT from `localStorage`, validate its expiry, and restore the authenticated session if the token is still valid.
4. THE System SHALL use Axios instances with a base URL configured from an environment variable `VITE_API_BASE_URL` and an interceptor that attaches the `Authorization` header automatically.
5. THE System SHALL organise the frontend source into the directories: `components/`, `pages/`, `layouts/`, `hooks/`, `services/`, `context/`, `routes/`, `utils/`, and `assets/`.
6. THE System SHALL implement a `useAuth` custom hook that provides access to the `AuthProvider` context values.

---

### Requirement 15: Backend Architecture

**User Story:** As a developer, I want a well-structured Express.js backend, so that the codebase is modular, testable, and easy to extend.

#### Acceptance Criteria

1. THE System SHALL organise the backend source into the directories: `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `utils/`, `services/`, `app.js`, and `server.js`.
2. THE System SHALL define Mongoose models for `User`, `Attendance`, `Leave`, and `Regularization` with the fields specified in the Glossary and database model definitions.
3. THE System SHALL implement a centralised error-handling middleware in Express that catches all unhandled errors and returns a consistent JSON error response.
4. THE System SHALL use `dotenv` to load environment variables from a `.env` file in development and from the hosting platform's environment in production.
5. THE System SHALL implement a `connectDB` utility in `config/` that establishes the MongoDB Atlas connection and logs the connection status on startup.
6. WHEN the backend server starts, THE System SHALL log the port number and database connection status to the console.
