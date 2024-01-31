import {login} from "./utils/login.js";
import {getProductsPrices} from "./utils/fetch-data.js";
import {addProducts} from "./utils/data.js";

console.time('Runtime')
const cookieHeader = await login();

const productIds = [
    66077,   3011532, 356434,  66622,
    3012642, 60540,   35765,   37287,
    3111563, 19574,   22614,   61905,
    57018,   3323159, 2389754, 425132,
    2486911, 28113,   2840702,  83946,
    58074,   53242,   2300978,  53849,
    37147
];

console.log('cookieHeader', cookieHeader);

const products = await getProductsPrices(cookieHeader, productIds);

await addProducts(products);

console.timeEnd('Runtime');
