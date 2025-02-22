import { Client, Account, Databases, Storage } from "appwrite";
import conf from "../../appwrite/conf.js";


const client = new Client()
    .setEndpoint(conf.appwriteEndpoint)
    .setProject(conf.appwriteProjectId)
    // .setPlatform(conf.appwritePlatform)

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };