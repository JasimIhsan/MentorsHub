import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ITokenService } from "../../../application/interfaces/user/token.service.interface";
import { IHashService } from "../../../application/interfaces/services/hash.service";
import { UserEntity } from "../../../domain/entities/user.entity";
import { GoogleConfig } from "./config/google.config";

dotenv.config();

export const configurePassport = (userRepo: IUserRepository, tokenService: ITokenService, hashService: IHashService) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: GoogleConfig.GOOGLE_CLIENT_ID,
				clientSecret: GoogleConfig.GOOGLE_CLIENT_SECRET,
				callbackURL: "/api/auth/google/callback",
			},
			async (_accessToken, _refreshToken, profile: Profile, done) => {
				try {
					/**   Extract email */
					const email = profile.emails?.[0]?.value;
					if (!email) return done(new Error("Google email is required"), false);

					/**  Look up user */
					let user = await userRepo.findUserByEmail(email);

					/**   Create account if new */
					if (!user) {
						const randomPassword = hashService.generatePassword();
						const hashedPassword = await hashService.hashPassword(randomPassword);

						user = await userRepo.createUser(
							new UserEntity({
								email,
								password: hashedPassword,
								firstName: profile.name?.givenName ?? "",
								lastName: profile.name?.familyName ?? "",
								avatar: profile.photos?.[0]?.value ?? null,
								role: "user",
								status: "unblocked",
								mentorRequestStatus: "not-requested",
								googleId: profile.id,
								sessionCompleted: 0,
								averageRating: 0,
								totalReviews: 0,
								createdAt: new Date(),
							}),
						);
					}

					/**   Issue tokens */
					const accessToken = tokenService.generateAccessToken(user.id!);
					const refreshToken = tokenService.generateRefreshToken(user.id!);

					return done(null, { user, accessToken, refreshToken });
				} catch (err) {
					return done(err as Error, false);
				}
			},
		),
	);

	// ── Standard serialize / deserialize ────────────────────
	passport.serializeUser((payload: any, done) => done(null, payload));
	passport.deserializeUser((payload: any, done) => done(null, payload));
};
