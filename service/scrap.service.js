const SCRAP = require('../model/ScrapModel');
const constant = require('../utils/constant');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {

  createScrap: async (data, callback) => {
        const { url } = data;
        console.log('Backend URL:', url);
    
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            const nameFromUrl = new URL(url).hostname.replace('www.', '').split('.')[0];
            const formattedName = capitalizeFirstLetter(nameFromUrl); // Format name
    
            const scrapedData = await page.evaluate(() => {
                return {
                    name: document.querySelector('meta[property="og:site_name"]')?.content || document.title,
                    description: document.querySelector('meta[name="description"]')?.content || '',
                    logoUrl: document.querySelector('img, svg') ? (document.querySelector('img') ? document.querySelector('img').src : document.querySelector('svg')) : '',
                    facebook: document.querySelector('a[href*="facebook.com"]')?.href || '',
                    linkedin: document.querySelector('a[href*="linkedin.com"]')?.href || '',
                    twitter: document.querySelector('a[href*="twitter.com"]')?.href || '',
                    instagram: document.querySelector('a[href*="instagram.com"]')?.href || '',
                    address: document.querySelector('.address')?.textContent || '',
                    phone: document.querySelector('a[href*="tel"]')?.textContent || '',
                    email: document.querySelector('a[href^="mailto:"]') ? document.querySelector('a[href^="mailto:"]').innerText : '',
                };
            });

            const screenshotPath = path.join(__dirname, `../public/images/screenshot-${Date.now()}.png`);
            
            await page.screenshot({
                path: screenshotPath,
                fullPage: true
            });

            let logoPath = '';
            if (scrapedData.logoUrl) {
                const logoResponse = await page.goto(scrapedData.logoUrl);
                logoPath = path.join(__dirname, `../public/images/logo-${Date.now()}.png`);
                fs.writeFileSync(logoPath, await logoResponse.buffer()); 
                console.log('Logo saved at:', logoPath);
            }
    
            await browser.close();
    
            // return
    

            const newScrap = new SCRAP({
                url:url,
                name: formattedName,
                description: scrapedData.description,
                logo: logoPath ? logoPath.split('\\').pop() : '', 
                facebook: scrapedData.facebook,
                linkedin: scrapedData.linkedin,
                twitter: scrapedData.twitter,
                instagram: scrapedData.instagram,
                address: scrapedData.address,
                phone: scrapedData.phone,
                email: scrapedData.email,
                screenshot: screenshotPath.split('\\').pop(), // Save relative path of screenshot
            });
    
            await newScrap.save();
    
            callback(null, {
                status: constant.success_code,
                message: 'Scrap created successfully!',
                data: newScrap,
            });
    
        } catch (err) {
            console.error('Error during web scraping:', err.message);
            callback({
                status: constant.error_code,
                message: err.message,
            }, null);
        }
    },
    // Fetch all scraps
    getAllScraps: async (callback) => {
        try {
            const scraps = await SCRAP.find({ status: 1 }); // Fetch all active scraps
            callback(null, {
                status: constant.success_code,
                message: 'All scraps fetched successfully!',
                data: scraps,
            });
        } catch (err) {
            callback({
                status: constant.error_code,
                message: 'Failed to fetch scraps.',
            }, null);
        }
    },
    // Fetch a single scrap by ID
    getScrapById: async (id, callback) => {
        try {
            const scrap = await SCRAP.findById(id);

            if (!scrap) {
                return callback({
                    status: constant.error_code,
                    message: 'Scrap not found.',
                }, null);
            }

            callback(null, {
                status: constant.success_code,
                message: 'Scrap fetched successfully!',
                data: scrap,
            });
        } catch (err) {
            callback({
                status: constant.error_code,
                message: 'Failed to fetch scrap by ID.',
            }, null);
        }
    },

    //delete Scrap
    deleteScrap: async (ids, callback) =>{
        try {
            const result = await SCRAP.deleteMany({
                _id: { $in: ids } 
            });
    
            if (result.deletedCount > 0) {
                callback(null, {
                    status: constant.success_code,
                    message: `scrap deleted successfully!`,
                });
            } else {
                callback({
                    status: constant.error_code,
                    message: "No scraps found to delete!",
                }, null);
            }
        } catch (err) {
            // Return an error in the callback if something goes wrong
            callback({
                status: constant.error_code,
                message: err.message,
            }, null);
        }
    }
};
