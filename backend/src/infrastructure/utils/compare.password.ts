import bcrypt from "bcryptjs";

export const comparePassword = (password: string, hashedPassword: string) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hashedPassword, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
