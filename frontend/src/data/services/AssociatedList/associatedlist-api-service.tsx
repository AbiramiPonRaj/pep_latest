import HttpClientWrapper from "../../api/http-client-wrapper";

// import { AssociatedlistPayload } from "./associatedlist-payload";

class AssociatedListApiService {
    private httpClientWrapper: HttpClientWrapper;
  
    constructor() {
      this.httpClientWrapper = new HttpClientWrapper();
    }
getAssociatedList = async () => {
    try {
        const response = await this.httpClientWrapper.get('/api/v1/AssociatedList');
        return response;
    } catch (error) {
        // Handle the error as needed
        throw error;
    }
}
getListOfCompany = async () => {
    try {
        const response = await this.httpClientWrapper.get('/api/v1/ListOfCompany/GetListOfCompany');
        console.log('getListOfCompany:', response);
        return response;
    } catch (error) {
        throw error;
    }
}
}
      
  
  
export default AssociatedListApiService;