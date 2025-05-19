import HttpClientWrapper from "../../api/http-client-wrapper";
import { ContactsDetailsRequestPayload } from "./contactsdetailsrequest-payload";

// Import statements and other code...

class ContactsDetailsRequestApiService {
    private httpClientWrapper: HttpClientWrapper;
  
    constructor() {
      this.httpClientWrapper = new HttpClientWrapper();
    }
  
    saveContactsRequest = async (payload:ContactsDetailsRequestPayload ) => {
        console.log(`LLPsApiService saveCustomerRequest() start = ${JSON.stringify(payload)}`);
        try {
          const response = await this.httpClientWrapper.post('/api/v1/ContactsDetails/CreateContactsDetailsRequest', payload);
          const data = response.data;
          // console.log("Response data:", data);
          return data;
        } catch (error) {
          console.error("LLPsApiService saveCustomerRequest() error:", error);
          throw error;
        }
      }
      
  }
  
  export default ContactsDetailsRequestApiService;
  