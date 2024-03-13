import { basketOfGoods } from "./basket-of-goods.js";
import { addProducts } from "./utils/data.js";
import { getProductsPrices } from "./utils/fetch-data.js";
import { login } from "./utils/login.js";

console.time("Runtime");
const cookieHeader = await login();

const productIds = basketOfGoods.map((product) => product.localGroceryId);

const products = await getProductsPrices(cookieHeader, productIds);

await addProducts(products, "local-grocery-price-changes");

console.timeEnd("Runtime");
