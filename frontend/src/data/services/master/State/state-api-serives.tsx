
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { StatePayload } from "./state-payload";

class StateApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

 

    // GET request to fetch all ministries
    getStateDataByCountryId = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/State');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
   
}

export default StateApiService;
