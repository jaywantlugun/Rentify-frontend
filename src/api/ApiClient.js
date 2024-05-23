import axios from "axios";

export const apiClient = axios.create(
    {
        baseURL: 'https://rentify-backend-production.up.railway.app/' 
    }
);