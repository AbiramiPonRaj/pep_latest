
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RelativePayload } from "./relative-payload";
class RelativeApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    
    // GET request to fetch all ministries
    getRelative = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ConfigRelative');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
 
}

export default RelativeApiService;
