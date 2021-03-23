import puppeteer from 'puppeteer';

async function getWords() {
	try {
    console.log("start pup");
		const URL = 'https://www.randomlists.com/nouns?dup=false&qty=25';
		const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      headless: false,
    });
    console.log("pre browser");
		const page = await browser.newPage();
    console.log("browser");
    await page.goto(URL);
    return await page.evaluate(() => {
      const words = Array.from(document.querySelectorAll('span.rand_large'));
      const result = words.map(word => {
        return word.innerText;
      });
      console.log(result);
      return result;
    });
		await browser.close()
	} catch (error) {
		console.error(error)
	}
}

getWords();
