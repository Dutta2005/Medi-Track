import conf from "../../appwrite/conf";
import { databases, storage } from "../config/appwrite";
import { ID, Query } from "appwrite";

class ProductController {
    async createProduct(productData) {
        try {
            const response = await databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                ID.unique(),
                {
                    name: productData.name,
                    quantity: Number(productData.quantity),
                    expiry_date: String(productData.expiryDate),
                    category: productData.category,
                    reorderPoint: Number(productData.reorderPoint),
                    userId: productData.userId,
                    dosageInstructions: productData.dosageInstructions,
                    image: productData.image,
                    scheduleType: productData.scheduleType || "custom",
                    dailyDosages: productData.dailyDosages || [],
                    weeklyDosages: productData.weeklyDosages || [],
                    customSchedule: productData.customSchedule || []
                }
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateProduct(productId, updates) {
        try {
            const response = await databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                productId,
                {
                    ...updates,
                    dailyDosages: JSON.stringify(updates.dailyDosages || []),
                    weeklyDosages: JSON.stringify(updates.weeklyDosages || []),
                    customSchedule: JSON.stringify(updates.customSchedule || {})
                }
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getProducts(userId) {
        try {
            const response = await databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            );
            return { success: true, data: response.documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getProduct(productId) {
        try {
            const response = await databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                productId
            );
            return { success: true, 
                data: {
                    ...response,
                    dailyDosages: JSON.parse(response.dailyDosages || "[]"),
                    weeklyDosages: JSON.parse(response.weeklyDosages || "[]"),
                    customSchedule: JSON.parse(response.customSchedule || "{}")
                }
             };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteProduct(productId) {
        try {
            await databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductCollectionId,
                productId
            );
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async uploadImage(file) {
        try {
            const response = await storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteImage(imageId) {
        try {
            await storage.deleteFile(
                conf.appwriteBucketId, 
                imageId
            );
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getImage(imageId) {
        try {
            const response = await storage.getFileView(
                conf.appwriteBucketId,
                imageId
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new ProductController();