const puppeteer = require('puppeteer')

const urls = ["https://www.airbnb.co.uk/rooms/37353019", "https://www.airbnb.co.uk/rooms/20669368", "https://www.airbnb.co.uk/rooms/50633275"]

const getPageHTMLAmenities = async (url) => {
    try {
        //Launch headless browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //Access amenities through amenities url
        await page.goto(`${url}/amenities?`, { waitUntil: 'domcontentloaded'});
        //Wait for page-specific element to load to ensure fully loaded
        await page.waitForSelector('._gfomxi', {timeout: 5000});
        //Obtain amenities sections
        let amenitiesHtml = await page.$$('.rcem0st')
        let amenities = []
        //Cycle through found DOM elements and retrieve and format data
        for(let i = 0; i < amenitiesHtml.length; i++){
            let item = await amenitiesHtml[i].evaluate( node => node.innerText)        
            if(item.includes('Unavailable')){
                item = item.split('\n')[0]
            }
            amenities.push(item.replace("\n", ": "))
        }
        //Close browser instance
        await browser.close();
        return amenities
    } catch (error) {
      console.log(error);
    }
};

const getPageHTML = async (url) => {
    try {
        //Launch headless browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded'});
        //Wait for page-specific element to load to ensure fully loaded
        await page.waitForSelector('._fecoyn4', {timeout: 5000});
        //Locate property name and property info sections
        const propName = await (await page.$('._fecoyn4')).evaluate( node => node.innerText);
        const propertyInfo = await page.$$('.l7n4lsf')
        const numOfBeds = await propertyInfo[1].evaluate( node => node.innerText);
        const numOfBaths = await propertyInfo[3].evaluate( node => node.innerText);
        //Relay property info to console
        console.log("Property url: ", url)
        console.log("Property name: ", propName)
        console.log("Number of bedrooms: ", numOfBeds.split(" ")[2])
        console.log("Number of bathrooms: ", numOfBaths.split(" ")[2])
        //Call amenities function
        console.log("Amenities: ", await getPageHTMLAmenities(url))
        await browser.close();
    } catch (error) {
      console.log(error);
    }
};

//Call function for each of the urls in the urls array
(async function() {
    for await (let url of urls) {
        await getPageHTML(url)
    }
})();