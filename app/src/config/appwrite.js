import { Client, Account } from "appwrite";
import conf from "../../appwrite/conf.js";


const client = new Client()
    .setEndpoint(conf.appwriteEndpoint)
    .setProject(conf.appwriteProjectId)
    // .setPlatform(conf.appwritePlatform)

const account = new Account(client);

export { client, account };