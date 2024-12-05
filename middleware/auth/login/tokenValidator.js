import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../../../config/config";

const secretKey = appConfig.tokenSecretKey;

export const tokenValidator = async(req, res, next) => {
    const tokenHeader = req.headers.authorization;
    const webToken = tokenHeader && tokenHeader.split(' ')[1];

    // TODO: Have to add a validator for the Web Token.

    if(tokenHeader == null || webToken == null){
        res.status(401).send({
            MESSAGE: "No Token. Unauthorized Access."
        });
        return;
    }

    const publicKey = readFileSync('RSA/publicKey.pem', 'utf8');
    try {
        const payloadData = await jwt.verify(webToken, publicKey, { algorithms: ['RS256'] });
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