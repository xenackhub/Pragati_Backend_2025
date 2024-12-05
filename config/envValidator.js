import validator from "validator";

const validateEnv = () => {
    const rules = {
        SERVER_PORT: 'number',
        DB_PWD: 'string',
        SECRET_KEY: 'string'
    };
    const isValid = Object.entries(rules).every(([key, type]) => {
        const value = process.env[key];
        if (!value) {
            console.error(`[ERROR]: Missing Key: ${key}.`);
            return false;
        }
        if (type === 'number' && !validator.isNumeric(value)) {
            console.error(`[ERROR]: Invalid Value for ${key}. Expected Number. Got ${value}.`);
            return false;
        }
        if (type === 'string' && validator.isEmpty(value)) {
            console.error(`[ERROR]: Invalid Value for ${key}. Expected non-empty String. Got ${value}.`);
            return false;
        }
        
        return true;
    });
    if (!isValid) {
      return false;
    }
    console.log('[LOG]: All env variables validated.');
    return true;
};
export {
    validateEnv
}
