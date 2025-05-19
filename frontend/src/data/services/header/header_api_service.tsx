import HttpClientWrapper from "../../api/http-client-wrapper";
import { HeaderPayload } from "./header_payload";

class HeaderApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    async accessPermission(uid: string, id: string): Promise<{}> {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/accessPermission?uid=${uid}&id=${id}`);
            return response;
        } catch (error) {
            console.error("Error fetching Access Permission:", error);
            throw error;
        }
    }
}

export default HeaderApiService;
