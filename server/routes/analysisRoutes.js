import express from "express";
import auth from "../middlewares/auth.js";
import { analyzeUrl, deleteAnalysis, getAnalyses } from "../controllers/analysisController.js";



const analysisRouter = express.Router();

analysisRouter.post('/analyze', auth, analyzeUrl);
analysisRouter.get('/list', auth, getAnalyses);
analysisRouter.get('/:id',auth, getAnalyses);
analysisRouter.delete('/:id', auth, deleteAnalysis);


export default analysisRouter;
