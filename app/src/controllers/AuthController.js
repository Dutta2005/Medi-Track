import { account } from "../config/appwrite"
import { ID } from 'appwrite';

class AuthController {
    // Register new user
    async register(email, password, name) {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Login user
    async login(email, password) {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            return {
                success: true,
                data: session
            };
        } catch (error) {
            await account.deleteSession('current');
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            const user = await account.get();
            return {
                success: true,
                data: user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Logout user
    async logout() {
        try {
            console.log('Starting logout process');  // Debug log
            const result = await account.deleteSession('current');
            console.log('Session deletion result:', result);  // Debug log
            
            return {
                success: true
            };
        } catch (error) {
            console.error('Logout error details:', error);  // Detailed error log
            return {
                success: false,
                error: error.message || 'Failed to logout'
            };
        }
    }
}

export default new AuthController();
