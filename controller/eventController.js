import eventModule from "../module/eventModule";
import { validateAddEventsData } from "../utilities/dataValidator";
import { setResponseBadRequest } from "../utilities/response";

const eventController = {
  /*
    Request Header: Bearer Token
    {
      "eventName": "string",
      "imageUrl": "string",
      "eventFee": number,
      "eventDescription": "string",
      "eventDescSmall": "string",
      "isGroup": "boolean",
      "maxTeamSize": number,
      "minTeamSize": number,
      "eventDate": "character",
      "maxRegistrations": number,
      "isPerHeadFee": "boolean",
      "godName": "string",
      "organizerIDs": [number, number,...],
      "tagIDs": [number, number,...],
      "clubID": number
    }
  */
  addEvent: async (req, res) => {
    const {
      eventName,
      imageUrl,
      eventFee,
      eventDescription,
      eventDescSmall,
      isGroup,
      eventDate,
      maxRegistrations,
      isPerHeadFee,
      godName,
      organizerIDs,
      tagIDs,
      clubID,
    } = req.body;

    //validating the req.body
    const errors = validateAddEventsData(req.body);
    if (errors != null) {
      const response = setResponseBadRequest(errors);
      return res.status(response.responseCode).json(response.responseBody);
    }

    // assigning default value to team size, as it will be undefined if isGroup is false
    let maxTeamSize = 1;
    let minTeamSize = 1;

    if (isGroup === true) {
      maxTeamSize = req.body.maxTeamSize || 1;
      minTeamSize = req.body.minTeamSize || 1;
    }
  },
};

export default eventController;
