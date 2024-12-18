import { getAllTransactionsData } from '../module/adminModule.js';
import { 
  setResponseOk, 
  setResponseInternalError 
} from '../utilities/response.js';

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await getAllTransactionsData();
    const response = setResponseOk('All transactions fetched successfully', { transactions });
    return res.status(response.responseCode).json(response.responseBody);
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    const response = setResponseInternalError();
    return res.status(response.responseCode).json(response.responseBody);
  }
};
