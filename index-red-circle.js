import {JSDOM} from "jsdom";
import {basketOfGoods} from "./basket-of-goods.js";
import {addProducts} from "./utils/data.js";

const goodsWebsitesPromises = basketOfGoods.map(async (good) => {
	const website = await fetch(`https://www.target.com/p/${good.nationalGroceryId}`)
		.then((response) => response.text());

	const {window} = new JSDOM(website, {
		// Theoretically Target could execute Node.js inside the JSDOM env however it is unlikely.
		runScripts: "dangerously",
		beforeParse: (window) => {
			window.scrollTo = () => {
			};
		}
	});

	let price;

	price = window.__TGT_DATA__.__PRELOADED_QUERIES__.queries.filter(query => query.at(0).at(0) === '@web/domain-product/get-pdp-v1').at(0).at(1).data.product.price.current_retail;

	if (!price) {
		price = window.__TGT_DATA__.__PRELOADED_QUERIES__.queries.filter(query => query.at(0).at(0) === '@web/domain-product/get-pdp-v1').at(0).at(1).data.product.price.current_retail_min;
	}

	return {
		productId: good.localGroceryId,
		price,
		description: good.product
	};
});

const goods = await Promise.all(goodsWebsitesPromises);

const goodsWithBasketTotal = [...goods, {
	productId: 0,
	description: "Basket Total",
	price: goods.reduce((total, good) => total + good.price, 0)
}];

await addProducts(goodsWithBasketTotal, "national-grocery-price-changes");
