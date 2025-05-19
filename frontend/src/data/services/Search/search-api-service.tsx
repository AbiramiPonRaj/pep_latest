import HttpClientWrapper from "../../api/http-client-wrapper";

import { Regulator } from "./search-payload";
class SearchService {
 
  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

//   getcustomer = async (pepId: string) => {
//     try {
//       const response = await this.httpClientWrapper.get(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }
getRegulator = async () => {
    try {
        const response = await this.httpClientWrapper.get('/api/v1/Gender');
        return response;
    } catch (error) {
     
        throw error;
    }
}


}

export default SearchService;



