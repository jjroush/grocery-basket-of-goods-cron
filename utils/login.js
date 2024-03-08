import puppeteer from "puppeteer-extra";

import StealthPlugin from "puppeteer-extra-plugin-stealth";

function delay(time) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}

async function untilCookiesAreSet(conditionFunction) {
	const poll = async (resolve) => {
		const result = await conditionFunction();
		if (result.cookies.find((x) => x.name === process.env.COOKIE_NAME)) {
			resolve(result.cookies);
		} else {
			console.log("Polling Auth Cookie...");
			setTimeout((_) => poll(resolve), 500);
		}
	};

	return new Promise(await poll);
}

export const login = async () => {
	puppeteer.use(StealthPlugin());

	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.setUserAgent(
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
	);

	// Navigate the page to a URL
	await page.goto(process.env.LOGIN_URL);

	console.log("Logging in...");

	await page.type("#username", process.env.EMAIL);
	await page.type("#password", process.env.PASSWORD);
	await delay(2000);

	const loginSelector = 'button[type="submit"]';
	await page.click(loginSelector);

	const client = await page.target().createCDPSession();
	const cookieMonster = await untilCookiesAreSet(
		async () => await client.send("Network.getAllCookies"),
	);

	const monsterCookie = cookieMonster
		.map((cookie) => `${cookie.name}=${cookie.value}`)
		.join(";");

	await browser.close();

	return monsterCookie;
};

export const redCirclelogin = async () => {
	// puppeteer.use(StealthPlugin())

	// https://oxylabs.io/resources/integrations/puppeteer

	// const browser = await puppeteer.launch({
	// 	headless: false,
	// 	args: ["--proxy-server=pr.oxylabs.io:10000"],
	// });
	// const page = await browser.newPage();
	//
	// await page.authenticate({
	// 	username: "sdfgwert342",
	// 	password: "xZ8wD4JCBFFI",
	// });

	// await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0');
	puppeteer.use(StealthPlugin());

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({ width: 1201, height: 1002 });

	await page.setCookie({
		name: "UserLocation",
		value: "50323|41.630|-93.840|IA|US",
		domain: ".target.com",
		path: "/",
		httpOnly: false,
		secure: true,
		sameSite: "Lax",
	});
	// Navigate the page to a URL
	await page.goto("https://www.target.com/p/navel-orange-each/-/A-15026732");

	await delay(1000);

	// const element = await page.$('[data-test="@web/AccountLink');

	// element.click();
	// console.log('Logging in...')
	//
	// await page.waitForSelector('#username');
	//
	// await page.type('#username', process.env.RED_CIRCLE_EMAIL, {delay: 100});
	// await delay(1000);
	//
	// await page.type('#password', process.env.RED_CIRCLE_PASSWORD, {delay: 100});
	// await delay(2000);
	//
	// // await page.mouse.move(100, 100);
	// //
	// const loginSelector = 'button[type="submit"]';
	// await page.hover(loginSelector);
	// await page.click(loginSelector);
	//
	// await page.type('#password', process.env.RED_CIRCLE_PASSWORD, {delay: 100});
	//
	// await page.hover(loginSelector);
	// await page.click(loginSelector);
};
