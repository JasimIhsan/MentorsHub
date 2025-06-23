// src/shared/utils/handle-error.ts
export function handleExceptionError<T>(error: unknown, message: string): T {
	console.error(`${message}:`, error);
	if (error instanceof Error) {
		throw new Error(`${message} - ${error.message}`);
	}
	throw new Error(message);
}
