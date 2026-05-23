import express from "express";
import auth from "../middlewares/auth.js";
import { addkeyword, deleteKeyword, getKeyword, getKeywords, refreshKeyword, toggleTracking } from "../controllers/rankController.js";


const rankRouter = express.Router();

rankRouter.post('/add', auth, addkeyword);
rankRouter.get('/list', auth, getKeywords);
rankRouter.get('/:id', auth, getKeyword);
rankRouter.post('/:id/refresh', auth, refreshKeyword);
rankRouter.put('/:id/toggle', auth, toggleTracking);
rankRouter.delete('/:id', auth, deleteKeyword);


export default rankRouter;