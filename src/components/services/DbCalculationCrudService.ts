import axios from 'axios'

export class DbCalculationCrudService <T> {

  public static apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;
  private readonly apiEndpoint;

  constructor(apiEndpoint?: string) {
    this.apiEndpoint = apiEndpoint;
  }

  public async fetchItem(itemId: number): Promise<T> {
    try {
      const response = await axios.get(`${DbCalculationCrudService.apiBaseUrl}${this.apiEndpoint}?id=${itemId}`);
      if (response.data.length == 1) {
        console.log(`Fetched item (${this.apiEndpoint}?id=${itemId})`, response.data[0]);
        return response.data[0];
      }
      else {
        throw new Error('More than one record! ' + response.data);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  }

}