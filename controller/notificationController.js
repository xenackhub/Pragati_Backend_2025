import notificationModule from "../module/notificationModule";
import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response";

const notificationController = {
    getAllNotifications: async (req, res) => {
        try {
            const response = await notificationModule.getAllNotifications();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "notificationController:getAllNotifications", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default notificationController;
