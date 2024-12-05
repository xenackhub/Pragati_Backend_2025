import jwt from "jsonwebtoken";
import { readFileSync } from "fs";

const secretKey = '925d6213ca342801d7d5d93767b55e94b8dffa4ab1c6d80ae792aeb8b947328a17623cc98644d912c2a87ae64f6ed27cbc16d3e6b12ca236bcac25ee08415cc9832d77aa9554fdbf2d3782545a2768a5284c06c2fddcd06fdb52f4301740fd50d2429da1fe064bbd08a339fa5935ef2a5eafc379ec5d7741f1a72c7c148c08ef';

export const tokenValidator = async(req, res, next) => {
    const tokenHeader = req.headers.authorization;
    const webToken = tokenHeader && tokenHeader.split(' ')[1];

    // TODO: Have to add a validator for the Web Token.

    if(tokenHeader == null || webToken == null){
        res.status(401).send({
            MSG: "No Token. Unauthorized Access."
        });
        return;
    }

    const publicKey = readFileSync('RSA/publicKey.pem');
    try {
        const payloadData = await jwt.verify(webToken, publicKey, { algorithms: ['RS256'] });
        if(payloadData["SECRET_TOKEN"] == secretKey){
            req.body.userEmail = payloadData["userEmail"];
            req.body.userID = payloadData["userID"];
            next();
            return;
        }
        else {
            res.status(401).send({
                MSG: "Unauthorized Access."
            });
            return;
        }
    } catch (error) {
        res.status(401).send({
            MSG: "Unauthorized Access"
        });
        return;
    }
}