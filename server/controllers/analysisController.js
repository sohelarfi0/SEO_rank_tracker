import Analysis from "../models/Analysis";
import { scrapeUrl } from "../services/scraperService";


// Analyze a URL
export const analyzeUrl = async (req , res)=> {

    try {
        const {url} = req.body;

        if(!url) return res.status(400).json({success: false, message: "URL is required"});

        // Validate URL format
        let validUrl;
        try{
            validUrl = new URL(url.startWith("http") ? url : `https://${url}`);

        }
    catch(error){
        return res.status(400).json({ success: false, message: "Invalid URL format"});

    }

    // Create analysis record with pending status
    const analysis = await Analysis.create({userId: req.userId, url: validUrl.href, status: "processing"});

    // send immediate response with analysis ID
    res.json({ success: true, message: "Analysis started",
        analysisId: analysis.__id
    })


    // Run  Scraping and analysis in background
    try {
        // step 1: scrape the url with browserBase
        
        const  scrapeResult = await scrapeUrl(validUrl.href)

        if(!scrapeResult.success){
            analysis.status = "failed";
            await analysis.save();
            return;
        }
        // step 2: Analysis with Gemini AI

        
    } catch (bgError) {
        console.error("Background analysis error:", bgError.message);
        try {
            analysis.status = "failed";
            await analysis.save()

            
        } catch (saveError) {

            
        }
        console.error("Failed to save failed status:", saveError.message);
        
    } 
}  
     catch (error) {
        console.error("Analysis URL error:", error.message);
        if(!res.headersSent){
            res.status(500).json({success: false, message: "Server error"})
        }
    }
    }



//  Get analysis by ID
export  const getAnalysis = async (res, req)=> {

}

// Get all analyses for user

export const getAnalyses = async (req, res) => {

}

//  Delete analysis
export const deleteAnalysis = async (req, res) => {

}
