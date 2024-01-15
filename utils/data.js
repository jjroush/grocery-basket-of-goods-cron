import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const docClient = DynamoDBDocumentClient.from(client);

export const addProducts = async (products) => {
    let products = [];
    for (const {productId, description} of products) {
        const put = new PutCommand({
            TableName: "local-grocery-price-changes",
            Item: {
                productId,
                "timestamp": new Date().toISOString(),
                description,
            },
        });
        const putCommandPromise = docClient.send(put);

        products.push(put);

        const insert = await Promise.all(products);
    }

}
