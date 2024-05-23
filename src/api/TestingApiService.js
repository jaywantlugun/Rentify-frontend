import { apiClient } from "./ApiClient";

export const helloTesting
    = () => apiClient.get(`/auth/hello`)