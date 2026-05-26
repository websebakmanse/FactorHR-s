# Requirements Document

## Introduction

This feature implements a secure JWT-based authentication system with automatic access token refresh for FactoHR, a MERN stack HR & Employee Management System. The system replaces the current hardcoded credential check with a real backend authentication flow. It issues short-lived Access Tokens (15 minutes) and long-lived Refresh Tokens (7 days) stored as HttpOnly cookies. When an Access Token expires, the frontend silently obtains a new one using the Refresh Token without requiring the user to log in again. Refresh Tokens are rotated on every use to limit the blast radius of token theft. The system supports two roles: HR Admin and Employee.

---

## Glossary

- **Auth_Service**: The backend Express.js service responsible for issuing, validating, and revoking JWT tokens.
- **Access_Token**: A short-lived JWT (15-minute expiry) sent in the `Authorization: Bearer` header, used to authenticate API requests.
- **Refresh_Token**: A long-lived JWT (7-day expiry) stored in an HttpOnly, Secure, SameSite=Strict cookie, used to obtain new Access Tokens.
- **Token_Store**: The MongoDB collection (`refreshTokens`) that persists active Refresh Token records for revocation checks.
- **Auth_Middleware**: The Express middleware that validates the Access Token on protected routes.
- **Axios_Interceptor**: The frontend Axios response interceptor that detects 401 responses and transparently retries requests after refreshing the Access Token.
- **AuthContext**: The React Context that holds the authenticated user state, Access Token, and auth helper functions across the frontend.
- **Protected_Route**: A React Router route component that redirects unauthenticated users to the login page.
- **User**: A registered FactoHR user with a role of either `admin` or `employee`.
- **Token_Rotation**: The practice of issuing a new Refresh Token and invalidating the old one each time a token refresh occurs.

---

## Requirements

### Requirement 1: User Login

**User Story:** As a User, I want to log in with my email and password, so that I receive tokens that authenticate my subsequent requests.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/auth/login` with a valid email and password, THE Auth_Service SHALL return an Access_Token in the response body and set a Refresh_Token as an HttpOnly, Secure, SameSite=Strict cookie.
2. WHEN a POST request is made to `/api/auth/login` with a valid email and password, THE Auth_Service SHALL issue an Access_Token with an expiry of exactly 15 minutes.
3. WHEN a POST request is made to `/api/auth/login` with a valid email and password, THE Auth_Service SHALL issue a Refresh_Token with an expiry of exactly 7 days.
4. WHEN a POST request is made to `/api/auth/login` with a valid email and password, THE Auth_Service SHALL persist the Refresh_Token record in the Token_Store including both the token value and its expiry timestamp.
5. IF the email does not correspond to a registered User or the password does not match the stored hash, THEN THE Auth_Service SHALL respond with HTTP 401 Unauthorized with a generic error message in the response body that does not distinguish which field was incorrect.
6. IF the request body is missing the `email` or `password` field, THEN THE Auth_Service SHALL respond with HTTP 400 Bad Request with a field-specific error message identifying the missing field.
7. WHEN a POST request is made to `/api/auth/login` with valid credentials, THE Auth_Service SHALL include the authenticated User's role as a `role` claim in the Access_Token payload.

---

### Requirement 2: Access Token Validation on Protected Routes

**User Story:** As a User, I want my API requests to be authenticated automatically, so that I do not need to manually attach credentials to every call.

#### Acceptance Criteria

1. WHEN a request to a protected route includes a valid, non-expired Access_Token in the `Authorization: Bearer` header, THE Auth_Middleware SHALL allow the request to proceed.
2. IF a request to a protected route is missing the `Authorization` header, or the header is present but uses a scheme other than `Bearer`, or the token value is absent, THEN THE Auth_Middleware SHALL respond with HTTP 401 Unauthorized.
3. IF a request to a protected route contains an Access_Token with an invalid signature, THEN THE Auth_Middleware SHALL respond with HTTP 401 Unauthorized.
4. IF a request to a protected route contains an expired Access_Token, THEN THE Auth_Middleware SHALL respond with HTTP 401 Unauthorized.
5. WHEN the Auth_Middleware successfully validates a request, THE Auth_Middleware SHALL attach the decoded User payload (id, role) to the request object for downstream handlers.
6. IF the decoded Access_Token payload is missing the required `id` or `role` fields, THEN THE Auth_Middleware SHALL respond with HTTP 401 Unauthorized.

---

### Requirement 3: Silent Access Token Refresh

**User Story:** As a User, I want my session to continue seamlessly after my Access Token expires, so that I am not interrupted mid-task by an unexpected logout.

#### Acceptance Criteria

1. WHEN a valid Refresh_Token cookie is present and the Access_Token has expired, THE Auth_Service SHALL validate the Refresh_Token, issue a new Access_Token, and return it in the response body of a POST request to `/api/auth/refresh`.
2. WHEN a new Access_Token is issued via `/api/auth/refresh`, THE Auth_Service SHALL perform Token_Rotation by issuing a new Refresh_Token cookie and invalidating the previous Refresh_Token in the Token_Store.
3. WHEN the Axios_Interceptor receives an HTTP 401 response from a protected route, THE Axios_Interceptor SHALL call `/api/auth/refresh` to obtain a new Access_Token and then retry the original request exactly once with the new Access_Token.
4. WHEN multiple concurrent requests receive HTTP 401 simultaneously (up to a maximum of 50 queued requests), THE Axios_Interceptor SHALL queue the concurrent requests and replay all of them after a single token refresh completes, rather than triggering multiple refresh calls.
5. IF the `/api/auth/refresh` call returns HTTP 401, THEN THE Axios_Interceptor SHALL remove the Access_Token from AuthContext so the User is treated as unauthenticated, reject all queued requests with a session-expiry error, and redirect the User to the login page.
6. IF the Refresh_Token cookie is absent, expired, or invalid when `/api/auth/refresh` is called, THEN THE Auth_Service SHALL respond with HTTP 401 Unauthorized and clear the Refresh_Token cookie.

---

### Requirement 4: Refresh Token Validation

**User Story:** As a security-conscious system, I want invalid or revoked Refresh Tokens to be rejected, so that compromised tokens cannot be used to obtain new Access Tokens.

#### Acceptance Criteria

1. IF the Refresh_Token cookie is missing from the request to `/api/auth/refresh`, THEN THE Auth_Service SHALL respond with HTTP 401 Unauthorized.
2. IF the Refresh_Token has an invalid JWT signature or is structurally malformed (not a valid JWT format), THEN THE Auth_Service SHALL respond with HTTP 401 Unauthorized.
3. IF the Refresh_Token has expired (older than 7 days), THEN THE Auth_Service SHALL respond with HTTP 401 Unauthorized.
4. IF the Refresh_Token is not present in the Token_Store (i.e., it has been revoked or already rotated), THEN THE Auth_Service SHALL respond with HTTP 401 Unauthorized.
5. WHEN THE Auth_Service rejects a Refresh_Token for any reason, THE Auth_Service SHALL clear the Refresh_Token cookie by setting it with `Max-Age=0` and an expired date in the response.

---

### Requirement 5: Logout

**User Story:** As a User, I want to log out, so that my session is fully terminated and my Refresh Token cannot be reused.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/auth/logout` with a Refresh_Token cookie whose value matches a record in the Token_Store, THE Auth_Service SHALL delete that Refresh_Token record from the Token_Store.
2. WHEN a POST request is made to `/api/auth/logout` with a Refresh_Token cookie that is present but not found in the Token_Store, THE Auth_Service SHALL still clear the cookie and respond with HTTP 200 OK.
3. WHEN a POST request is made to `/api/auth/logout`, THE Auth_Service SHALL clear the Refresh_Token cookie by setting it with an expired `Max-Age`.
4. WHEN a POST request is made to `/api/auth/logout`, THE Auth_Service SHALL respond with HTTP 200 OK regardless of whether a Refresh_Token cookie was present.
5. WHEN the User triggers logout on the frontend, THE AuthContext SHALL clear the stored Access_Token, the User's identity fields, and the authentication state so the User is treated as unauthenticated.
6. WHEN logout completes on the frontend, THE AuthContext SHALL navigate the User to the login page.

---

### Requirement 6: Role-Based Route Protection

**User Story:** As a User, I want to be directed to the correct dashboard based on my role, so that HR Admins and Employees see only the views relevant to them.

#### Acceptance Criteria

1. WHEN an authenticated User with role `admin` navigates to the HR dashboard route, THE Protected_Route SHALL render the HR dashboard component.
2. WHEN an authenticated User with role `employee` navigates to the Employee dashboard route, THE Protected_Route SHALL render the Employee dashboard component.
3. IF an unauthenticated User navigates to any protected route, THEN THE Protected_Route SHALL redirect the User to the login page.
4. IF an authenticated User with role `employee` attempts to navigate to an HR-only route, THEN THE Protected_Route SHALL redirect the User to the Employee dashboard.
5. IF an authenticated User with role `admin` attempts to navigate to an Employee-only route, THEN THE Protected_Route SHALL redirect the User to the HR dashboard.
6. WHILE the AuthContext is loading the initial authentication state, THE Protected_Route SHALL render a loading indicator rather than redirecting the User, and SHALL resolve the loading state within 5 seconds.

---

### Requirement 7: Persistent Authentication State

**User Story:** As a User, I want my session to survive a page refresh, so that I do not have to log in again after reloading the browser.

#### Acceptance Criteria

1. WHEN the frontend application initialises, THE AuthContext SHALL call `/api/auth/refresh` within 10 seconds to attempt to restore the User's session using the Refresh_Token cookie.
2. IF the `/api/auth/refresh` call succeeds on initialisation, THEN THE AuthContext SHALL store the returned Access_Token and decoded User payload (containing at minimum the user's identity and role) in memory.
3. IF the `/api/auth/refresh` call fails on initialisation due to a non-2xx response, network error, or timeout, THEN THE AuthContext SHALL set the authentication state to unauthenticated without displaying an error to the User.
4. THE AuthContext SHALL store the Access_Token in memory only (not in `localStorage` or `sessionStorage`) to reduce XSS exposure.
5. WHILE the initial `/api/auth/refresh` call is in-flight, THE AuthContext SHALL expose `isLoading: true`, and SHALL set `isLoading: false` only after the call resolves or rejects.

---

### Requirement 8: Secure Token Storage and Transmission

**User Story:** As a security-conscious system, I want tokens to be stored and transmitted securely, so that the risk of token theft via XSS or network interception is minimised.

#### Acceptance Criteria

1. WHEN the Auth_Service issues a Refresh_Token upon successful authentication, THE Auth_Service SHALL set the cookie with the `HttpOnly` flag, the `Secure` flag, `SameSite=Strict`, `Max-Age` of no more than 7 days (604800 seconds), and `Path=/`.
2. THE Auth_Service SHALL set the Refresh_Token cookie with the `Secure` flag so it is only transmitted over HTTPS.
3. THE Auth_Service SHALL set the Refresh_Token cookie with `SameSite=Strict` to mitigate CSRF attacks.
4. THE Auth_Service SHALL sign all JWTs using a secret of at least 256 bits stored in an environment variable, never hardcoded in source code.
5. THE Auth_Service SHALL hash User passwords using bcrypt with a minimum cost factor of 10 before storing them in the database.
6. THE AuthContext SHALL store the Access_Token in memory only and SHALL never persist it to `localStorage` or `sessionStorage`.
7. THE Auth_Service SHALL set the `exp` claim on all issued Access_Tokens to exactly 15 minutes from the time of issuance.
