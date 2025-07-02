import AWS from "aws-sdk";
import dotenv from "dotenv";
import { S3Config } from "./s3.config";

dotenv.config();

const s3 = new AWS.S3({
	accessKeyId: S3Config.AWS_ACCESS_KEY_ID,
	secretAccessKey: S3Config.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION!,
});

export default s3;
