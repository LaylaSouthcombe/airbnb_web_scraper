const puppeteer = require('puppeteer')

const urls = ["https://www.airbnb.co.uk/rooms/37353019", "https://www.airbnb.co.uk/rooms/20669368", "https://www.airbnb.co.uk/rooms/50633275"]

const getPageHTMLAmenities = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${url}/amenities?`, { waitUntil: 'domcontentloaded'});
        await page.waitForSelector('._gfomxi', {timeout: 5000});

        let ammenitiesHtml = await page.$$('.rcem0st')
        let ammenities = []
        for(let i = 0; i < ammenitiesHtml.length; i++){
            let item = await ammenitiesHtml[i].evaluate( node => node.innerText)        
            if(item.includes('Unavailable')){
            item = item.split('\n')[0]
            }
            ammenities.push(item.replace("\n", ": "))
        }
        await browser.close();
        return ammenities
    } catch (error) {
      console.log(error);
    }
};