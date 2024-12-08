import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../../config/config.js";

const secretKey = appConfig.otpTokenSecretKey;

export const otpTokenValidator = async(req, res, next) => {
    const tokenHeader = req.headers.authorization;
    const otpToken = tokenHeader && tokenHeader.split(' ')[1];

    // TODO: Have to add a validator for the Web Token.

    if(tokenHeader == null || otpToken == null){
        return res.status(401).send({
            MESSAGE: "No OTP Token. Unauthorized Access."
        });
    }

    const publicKey = readFileSync('middleware/encryptionKeys/publicKey.pem', 'utf8');
    try {
        const payloadData = jwt.verify(otpToken, publicKey, { algorithms: ['RS256'] });
        if(payloadData["SECRET_TOKEN"] == secretKey){
            req.body.userEmail = payloadData["userEmail"];
            req.body.userID = payloadData["userID"];
            next();
            return;
        }
        else {
            return res.status(401).send({
                MESSAGE: "Unauthorized Access."
            });
        }
    } catch (error) {
        return res.status(401).send({
            MESSAGE: "Unauthorized Access"
        });
    }
}