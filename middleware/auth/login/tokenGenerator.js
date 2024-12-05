import jwt from "jsonwebtoken";
import { readFileSync } from "fs";

const secretKey = '925d6213ca342801d7d5d93767b55e94b8dffa4ab1c6d80ae792aeb8b947328a17623cc98644d912c2a87ae64f6ed27cbc16d3e6b12ca236bcac25ee08415cc9832d77aa9554fdbf2d3782545a2768a5284c06c2fddcd06fdb52f4301740fd50d2429da1fe064bbd08a339fa5935ef2a5eafc379ec5d7741f1a72c7c148c08ef';

export const createToken = (payloadData) => {
    payloadData.SECRET_KEY = secretKey;
    const privateKey = readFileSync('RSA/privateKey.pem', 'utf8');
    const webToken = jwt.sign(payloadData, privateKey, {
        algorithm: 'RS256',
        expiresIn: '240m',
    });
    return webToken;
}
