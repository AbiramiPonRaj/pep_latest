import HttpClientWrapper from "../../api/http-client-wrapper";
import { DirectorNameEditPayload } from "./directorNameEdit_payload";


class DirectorNameEditApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getDirectorName = async (din: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/DinNameEdit?din=${din}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    saveDirectorName = async (payload: DirectorNameEditPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/DinNameEdit/CreateDinNameEdit', payload);
            return response;
        } catch (error) {
            console.error('Error Saving the DirectorName: ', error);
        }
    };

    updateDirector = async (id: number, name: string, din: string, uid: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/DirectorsMaster/UpdateDirectorsName?id=${id}`, { name, din, uid, euid });
            return response;
        } catch (error) {
            console.error("Error Updating the Director:", error);
            throw error;
        }
    };

}

export default DirectorNameEditApiService;