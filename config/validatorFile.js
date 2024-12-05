const dotenv = require('dotenv');
const validator = require('validator');

dotenv.config();

const validateEnv = () => {
    const rules = {
        NODE_ENV: 'string',
        PORT: 'number',
        DB_URL: 'url',
        API_KEY: 'string',
    };

    const isValid = Object.entries(rules).every(([key, type]) => {
        const value = process.env[key];
        if (!value || (type === 'number' && !validator.isNumeric(value)) || (type === 'url' && !validator.isURL(value)) || (typeof value !== type)) {
            console.error(`Invalid Key: ${key}`);
            return false;
        }
        return true;
    });

    if (!isValid) {
      process.exit(1);  //Exits when any one of the type in rules doesnot correspond to the correct key type
    }

    console.log('All variables validated.');
};

validateEnv(); //Calling the validate function to validate env variables

module.exports = process.env;
