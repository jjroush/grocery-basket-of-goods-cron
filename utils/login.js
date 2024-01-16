import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

async function untilCookiesAreSet(conditionFunction) {
    const poll = async resolve => {
        const result = await conditionFunction();
        if (result.cookies.find(x => x.name === process.env.COOKIE_NAME)) {
            resolve(result.cookies);
        } else {
            console.log('Polling Auth Cookie...');
            setTimeout(_ => poll(resolve), 500)
        }
    }

    return new Promise(await poll);
}


export const login = async () => {
    puppeteer.use(StealthPlugin())

    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0');

    // Navigate the page to a URL
    await page.goto(process.env.LOGIN_URL);

    console.log('Logging in...')

    await page.type('#username', process.env.EMAIL);
    await page.type('#password', process.env.PASSWORD);
    await delay(2000);

    const loginSelector = 'button[type="submit"]';
    await page.click(loginSelector);

    const client = await page.target().createCDPSession();
    const cookieMonster = await untilCookiesAreSet(async () => await client.send('Network.getAllCookies'));

    const monsterCookie = cookieMonster.map(cookie => `${cookie.name}=${cookie.value}`).join(';');

    await browser.close();

    return monsterCookie;
}