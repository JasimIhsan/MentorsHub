import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ITokenService } from "../../../application/interfaces/user/token.service.interface";
import { UserEntity } from "../../../domain/entities/user.entity";

dotenv.config();

export const configurePassport = (userRepo: IUserRepository, tokenService: ITokenService) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL: "/api/auth/google/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const email = profile.emails?.[0]?.value;
					if (!email) {
						return done(new Error("Google email is required"), false);
					}

					let user = await userRepo.findUserByEmail(email);
					if (!user) {
						user = await userRepo.createUser(await UserEntity.createWithGoogle(email, "", profile.name?.givenName || "", profile.name?.familyName || "", profile.id, profile.photos?.[0]?.value || ""));
					}

					const jwtAccessToken = tokenService.generateAccessToken(user.getId() as string);
					const jwtRefreshToken = tokenService.generateRefreshToken(user.getId() as string);

					return done(null, { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
				} catch (error) {
					return done(error, false);
				}
			}
		)
	);

	passport.serializeUser((user: any, done) => {
		done(null, user);
	});

	passport.deserializeUser((obj: any, done) => {
		done(null, obj);
	});
};
