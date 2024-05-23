import { apiClient } from "./ApiClient";

export const executeJwtAuthenticationService
    = (email, password) =>
        apiClient.post(`/auth/signin`, { email, password })

export const executeJwtSignupService
    = (firstName,lastName,email,password,phoneNumber) =>
        apiClient.post(`/auth/signup`, { firstName,lastName,email,password,phoneNumber })
    
    
export const fetchAllProperties
    = ()=>
        apiClient.get("/properties/all")