const conf = {
    appwritePlatform : String(import.meta.env.VITE_APPWRITE_PLATFORM),
    appwriteEndpoint : String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectId : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteProductCollectionId : String(import.meta.env.VITE_APPWRITE_PRODUCT_COLLECTION_ID),
    appwriteReminderCollectionId : String(import.meta.env.VITE_APPWRITE_REMINDER_COLLECTION_ID),
    appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    apikey : String(import.meta.env.VITE_API_KEY)
}

export default conf