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
            await account.deleteSession('current');
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new AuthController();
