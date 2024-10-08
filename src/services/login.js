import axios from "axios";

const login = async ({ email, password }) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/login', {
            email,
            password
        });
        localStorage.setItem('user', JSON.stringify(response.data));

        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export default {
    login,
}
