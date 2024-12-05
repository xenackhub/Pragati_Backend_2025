import validator from "validator";

dotenv.config();

const validateEnv = () => {
    const rules = {
        SERVER_PORT: 'number',
        DB_PWD: 'string',
    };

    const isValid = Object.entries(rules).every(([key, type]) => {
        const value = process.env[key];
        if (!value || (type === 'number' && !validator.isNumeric(value)) || (type === 'url' && !validator.isURL(value)) || (typeof value !== type)) {
            console.error(`[ERROR]: Invalid Key: ${key}`);
            return false;
        }
        return true;
    });

    if (!isValid) {
      return false;
    }

    console.log('[LOG]: All variables validated.');
    return true;
};

export {validateEnv}
