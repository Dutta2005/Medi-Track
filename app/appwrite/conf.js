import {APP_API_KEY, APP_APPWRITE_BUCKET_ID, APP_APPWRITE_DATABASE_ID, APP_APPWRITE_ENDPOINT, APP_APPWRITE_PLATFORM, APP_APPWRITE_PROJECT_ID, APP_APPWRITE_PRODUCTT_COLLECTION_ID, APP_APPWRITE_REMINDER_COLLECTION_ID} from '@env'

const conf = {
    appwritePlatform : String(APP_APPWRITE_PLATFORM),
    appwriteEndpoint : String(APP_APPWRITE_ENDPOINT),
    appwriteProjectId : String(APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseId : String(APP_APPWRITE_DATABASE_ID),
    appwriteProductCollectionId : String(APP_APPWRITE_PRODUCTT_COLLECTION_ID),
    appwriteReminderCollectionId : String(APP_APPWRITE_REMINDER_COLLECTION_ID),
    appwriteBucketId : String(APP_APPWRITE_BUCKET_ID),
    apikey : String(APP_API_KEY)
}

export default conf