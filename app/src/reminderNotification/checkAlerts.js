// checkAlerts.js
const sdk = require('node-appwrite');
const { default: conf } = require('../../appwrite/conf');

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200
  
  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
    // Initialize SDK
    const client = new sdk.Client();
    const database = new sdk.Databases(client);

    // Initialize client
    if (!req.variables[conf.appwriteProjectId] || !req.variables[conf.apikey]) {
        throw new Error('Environment variables are not set.');
    }

    client
        .setEndpoint(conf.appwriteEndpoint)
        .setProject(req.variables[conf.appwriteProjectId])
        .setKey(req.variables[conf.apikey]);

    try {
        // Get all products
        const products = await database.listDocuments(
            req.variables[conf.appwriteDatabaseId],
            req.variables[conf.appwriteProductCollectionId]
        );

        for (const product of products.documents) {
            // Check expiry
            const expiryDate = new Date(product.expiryDate);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntilExpiry <= 30) {
                await database.createDocument(
                    req.variables[conf.appwriteDatabaseId],
                    req.variables[conf.appwriteReminderCollectionId],
                    sdk.ID.unique(),
                    {
                        type: 'expiry',
                        productId: product.$id,
                        userId: product.userId,
                        message: `${product.name} will expire in ${daysUntilExpiry} days`,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                    }
                );
            }

            // Check stock
            if (product.quantity <= product.reorderPoint) {
                await database.createDocument(
                    req.variables[conf.appwriteDatabaseId],
                    req.variables[conf.appwriteReminderCollectionId],
                    sdk.ID.unique(),
                    {
                        type: 'lowStock',
                        productId: product.$id,
                        userId: product.userId,
                        message: `${product.name} is running low on stock (${product.quantity} remaining)`,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                    }
                );
            }
        }

        res.json({
            success: true,
            message: 'Alerts checked successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        }, 500);
    }
};