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

const getPageHTML = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded'});
        await page.waitForSelector('._fecoyn4', {timeout: 5000});
        const propName = await (await page.$('._fecoyn4')).evaluate( node => node.innerText);
        const numOfBedsHtml = await page.$$('.l7n4lsf')
        const numOfBeds = await numOfBedsHtml[1].evaluate( node => node.innerText);
        const numOfBaths = await numOfBedsHtml[3].evaluate( node => node.innerText);
        console.log("Property url: ", url)
        console.log("Property name: ", propName)
        console.log("Number of bedrooms: ", numOfBeds.split(" ")[2])
        console.log("Number of bathrooms: ", numOfBaths.split(" ")[2])
        const amenities = await getPageHTMLAmenities(url)
        console.log("Amenities: ", amenities)
        await browser.close();
    } catch (error) {
      console.log(error);
    }
};
  
(async function() {
    for await (let url of urls) {
        await getPageHTML(url)
    }
})();