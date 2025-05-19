import HttpClientWrapper from "../../api/http-client-wrapper";

class DirectorApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getDirector = async (pan: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/GetDirectors/{pan}?pan=${pan}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateDirector = async (id: number, name: string, din: string, uid: number, euid: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/DirectorsMaster/UpdateDirectorsMaster?id=${id}&euid=${euid}`, { name, din, uid, euid });
            return response;
        } catch (error) {
            console.error("Error Updating the Director:", error);
            throw error;
        }
    };

}

export default DirectorApiService;