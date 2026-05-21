import keywordTracking from "../models/keywordTracking.js";

export const addkeyword =  async (req , res ) => {

    try{
        const {keyword , url} = req.body;

        if(!keyword || !url) return res.status(400).json({success: false, mmessage: "keyword and url are required"});
       
        // Extract domain from url
        let domain;
        try{
            const urlObj = new URL(url.startsWith("http")? url: `http://${url}`);
            domain = urlObj.hostname.replace("www.","");

        }catch(error){
            return res.status(400).json({success: false, message: "Invalid URL format"});

        }

        // check if already tracking this keyword+domain
        const existing = await keywordTracking.findOne({userId: req.userId, keyword: keyword.toLowerCase().trim(),domain});

        if(existing) return res.status(400).json({success: false, message: "Already tracking this keyword for the given domain"});

        // create tracking entry

        const tracking = new keywordTracking.create({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startsWith("http") ? url : `https://${url}`,
            domain,
            status: "checking"
        })

        res.status(201).json({success: true, message:"Keyword tracking started", tracking});
        


    }catch(error){
        
    }


}