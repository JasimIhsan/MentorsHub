export enum CommonStringMessage {
	// General
	SERVER_ERROR_MESSAGE = "Internal Server Error",
	SUCCESS = "Success",
	FAILURE = "Something went wrong",
	BAD_REQUEST = "Bad Request",

	// Auth
	UNAUTHORIZED = "Unauthorized access",
	FORBIDDEN = "Access denied",
	TOKEN_NOT_PROVIDED = "Token not provided",
	INVALID_TOKEN = "Invalid or expired token",
	AUTHENTICATION_FAILED = "Authentication failed",
	BLOCKED = "Your account is blocked. Please contact support",

	// User
	USER_NOT_FOUND = "User not found",
	USER_ALREADY_EXISTS = "User already exists",
	USER_CREATED_SUCCESSFULLY = "User created successfully",
	USER_UPDATED_SUCCESSFULLY = "User updated successfully",
	USER_DELETED_SUCCESSFULLY = "User deleted successfully",
	USER_INVALID_CREDENTIALS = "Invalid credentials",

	// Mentor
	MENTOR_REQUEST_PENDING = "Mentor request is already pending",
	MENTOR_REQUEST_SUBMITTED = "Mentor request submitted successfully",
	MENTOR_PROMOTED_SUCCESSFULLY = "User promoted to mentor successfully",
	NOT_A_MENTOR = "You are not a mentor",

	// Admin
	ADMIN_NOT_FOUND = "Admin not found",
	ADMIN_ACCESS_ONLY = "Only admins can access this route",

	// Validation
	VALIDATION_FAILED = "Validation failed",
	MISSING_REQUIRED_FIELDS = "Missing required fields",
	INVALID_INPUT = "Invalid input provided",

	// Session / Booking
	SESSION_NOT_FOUND = "Session not found",
	ALREADY_BOOKED = "This time slot is already booked",
	SESSION_CREATED = "Session created successfully",
	SESSION_JOIN_SUCCESS = "Joined session successfully",

	// File Upload
	FILE_UPLOAD_FAILED = "File upload failed",
	FILE_TOO_LARGE = "File size is too large",
	INVALID_FILE_TYPE = "Invalid file type",

	// Notification
	NOTIFICATION_SENT = "Notification sent successfully",

	// Misc
	RESOURCE_NOT_FOUND = "Requested resource not found",
	OPERATION_NOT_ALLOWED = "Operation not allowed",
}
