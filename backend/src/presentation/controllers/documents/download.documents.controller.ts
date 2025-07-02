import { NextFunction, Request, Response } from "express";
import { IS3Service } from "../../../domain/interface/s3.service.interface";
import https from "https";
import { logger } from "../../../infrastructure/utils/logger";

export class DownloadDocumentsController {
	constructor(private s3Service: IS3Service) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const key = req.query.key as string;

			if (!key) {
				res.status(400).json({ message: "Missing document key" });
				return;
			}

			const signedUrl = await this.s3Service.getSignedUrl(key, 60);

			https
				.get(signedUrl, (s3Res) => {
					if (s3Res.statusCode !== 200) {
						res.status(s3Res.statusCode || 500).send("Failed to fetch file");
						return;
					}

					const fileName = key.split("/").pop();

					res.setHeader("Content-Type", s3Res.headers["content-type"] || "application/octet-stream");
					res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

					s3Res.pipe(res);
				})
				.on("error", (err) => {
					console.error("Error fetching S3 file:", err);
					res.status(500).send("Internal server error");
				});
		} catch (error) {
			logger.error(`❌ Error in DownloadDocumentsController: ${error}`);
			next(error);
		}
	}
}
