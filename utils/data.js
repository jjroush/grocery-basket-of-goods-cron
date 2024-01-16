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
    let dynamoRequests = [];
    for (const {productId, description, price} of products) {
        const put = new PutCommand({
            TableName: "local-grocery-price-changes",
            Item: {
                productId,
                "timestamp": new Date().toISOString(),
                price,
                description,
            },
        });

        const putCommandPromise = docClient.send(put);

        dynamoRequests.push(putCommandPromise);
    }

    await Promise.all(products);
}
