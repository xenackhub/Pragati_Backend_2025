import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../../config/config.js";

const secretKey = appConfig.otpTokenSecretKey;

export const createOTPToken = (payloadData) => {
    payloadData.SECRET_KEY = secretKey;
    const privateKey = readFileSync('RSA/privateKey.pem', 'utf8');
    const otpToken = jwt.sign(payloadData, privateKey, {
        algorithm: 'RS256',
        expiresIn: '240m',
    });
    return otpToken;
}