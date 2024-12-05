import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../../../config/config.js";

const secretKey = appConfig.tokenSecretKey;

export const createToken = (payloadData) => {
    payloadData.SECRET_KEY = secretKey;
    const privateKey = readFileSync('RSA/privateKey.pem', 'utf8');
    const webToken = jwt.sign(payloadData, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1d',
    });
    return webToken;
}
