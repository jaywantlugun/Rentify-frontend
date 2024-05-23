import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../api/ApiClient";
import { executeJwtAuthenticationService, executeJwtSignupService } from "../api/AuthenticationApiService";

// 1: Create a Context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// 2: Share the created context with other components
export default function AuthProvider({ children }) {
    // 3: Put some state in the context
    const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem('user_token'));
    const [email, setEmail] = useState(localStorage.getItem('user_email'));
    const [token, setToken] = useState(localStorage.getItem('user_token'));
    const [firstName, setFirstName] = useState(localStorage.getItem('user_firstName'));
    const [lastName, setLastName] = useState(localStorage.getItem('user_lastName'));
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('user_phoneNumber'));
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    const [error, setError] = useState(null); // Add state for error handling

    useEffect(() => {
        const storedToken = localStorage.getItem('user_token');

        if (storedToken) {
            apiClient.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = storedToken;
                    return config;
                },
                (error) => Promise.reject(error)
            );
        }

        return () => {
            // Remove the interceptor when the component is unmounted
            apiClient.interceptors.request.eject();
        };
    }, [token]);

    async function login(email, password) {
        try {
            const response = await executeJwtAuthenticationService(email, password);

            if (response.status === 200) {
                const jwtToken = 'Bearer ' + response.data.jwt;
                const { firstName, lastName, phoneNumber, id } = response.data;

                setAuthenticated(true);
                setEmail(email);
                setToken(jwtToken);
                setFirstName(firstName);
                setLastName(lastName);
                setPhoneNumber(phoneNumber);
                setUserId(id);
                
                localStorage.setItem('user_token', jwtToken);
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_firstName', firstName);
                localStorage.setItem('user_lastName', lastName);
                localStorage.setItem('user_phoneNumber', phoneNumber);
                localStorage.setItem('user_id', id);

                return true;
            } else {
                setError("Invalid email or password."); // Set error message for invalid credentials
                logout();
                return false;
            }
        } catch (error) {
            setError("An error occurred. Please try again."); // Set error message for generic errors
            console.log(error);
            logout();
            return false;
        }
    }

    async function signup(firstName, lastName, email, password, phoneNumber) {
        try {
            const response = await executeJwtSignupService(firstName, lastName, email, password, phoneNumber);

            if (response.status === 201) {
                const jwtToken = 'Bearer ' + response.data.jwt;

                setAuthenticated(true);
                setEmail(email);
                setToken(jwtToken);
                setFirstName(firstName);
                setLastName(lastName);
                setPhoneNumber(phoneNumber);
                setUserId(response.data.id);

                localStorage.setItem('user_token', jwtToken);
                localStorage.setItem('user_email', email);
                localStorage.setItem('user_firstName', firstName);
                localStorage.setItem('user_lastName', lastName);
                localStorage.setItem('user_phoneNumber', phoneNumber);
                localStorage.setItem('user_id', response.data.id);

                return true;
            } else {
                setError("Signup failed. Please try again."); // Set error message for signup failure
                logout();
                return false;
            }
        } catch (error) {
            setError("An error occurred. Please try again."); // Set error message for generic errors
            console.log(error);
            logout();
            return false;
        }
    }

    function logout() {
        setAuthenticated(false);
        setToken(null);
        setEmail(null);
        setFirstName(null);
        setLastName(null);
        setPhoneNumber(null);
        setUserId(null);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_firstName');
        localStorage.removeItem('user_lastName');
        localStorage.removeItem('user_phoneNumber');
        localStorage.removeItem('user_id');
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, signup, email, token, firstName, lastName, phoneNumber, userId, error }}>
            {children}
        </AuthContext.Provider>
    );
}
