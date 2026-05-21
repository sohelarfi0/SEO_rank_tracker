import {chromium} from 'playwright-core';
import Browserbase from 'browserbasehq/sdk';


const bb = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY,

});

// Search Google for a keyword and extract ranking results for a target domain
export async function rankTracker(keyword, targetDomain){
    let browser;
    try{
        // 1. Initialize Browserbase Session & Connect Playwright

        const session = await bb.sessions.create({browserSettings: {blockAds: true}});
        browser = await chromium.connectOverCDP(session.connectUrl);
        const page = browser.contexts()[0].pages()[0];
        page.setDefaultNavigationTimeout(45000);


        // 2. Initialize Google Visit & Consent Handling
        await page.goto("https://www.google.com", {waitUntil:"networkidle"});
        try{
            const btn = await page.$('button[id="L2AGLb"], form[action*="consent"] button')
            if(btn){
                await btn.click();
                await page.waitForTimeout(1500);
            }
        }
        catch{ }

        let found = null;
           allResults = [];

        const cleanTarget = targetDomain.replace("www.","").toLowerCase();

        // 3. Search Loop: Iterate through up to 5 pages of google results
        for(let gPage = 0; gPage<5; gPage++){
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${gPage*10}&num=10&h1=en&gl=us`, {waitUntil:"networkidle"});

            // 4. Page extraction: retry upto 3 times if results are missing
            let pageRsults = [];
            for(let retry = 0; retry<5; retry++){
                try{
                    await page.waitForSelector('h3',{timeout: 8000});
                    await page.waitForTimeout(1500)
                    pageRsults = await page.evaluate(()=>Array.from(document.querySelectorAll("h3")).
                    map(h3)=>{ let a = h3.closest('a'),
                        if(!a){
                            let p = h3.parentElement;
                            for()

                        }

                        

                    })
                }
            }
        }




    }catch(error){

    }
}



