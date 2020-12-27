import puppeteer from 'puppeteer';

export async function getWords() {
	try {
		const URL = 'https://www.randomlists.com/nouns?dup=false&qty=25';
		const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
		const page = await browser.newPage();

    await page.goto(URL);
    return await page.evaluate(() => {
      const words = Array.from(document.querySelectorAll('span.rand_large'));
      return words.map(word => {
        return word.innerText;
      })
    });
		await browser.close()
	} catch (error) {
		console.error(error)
	}
}

export const newUser = (userID, isHost = false) => {
  return {
    [userID]: {
      team: null,
      role: null,
      host: isHost,
    }
  };
}