import express, { Request, Response } from 'express';
import { AppConfigs } from './config/app';
import type { ErrorRequestHandler } from "express";
import bodyParser from 'body-parser';


const App = express();
App.use(express.json());
App.use(express.text());
App.use(express.raw());
App.use(bodyParser.json());
const errorHandler: ErrorRequestHandler = (err:any, req:any, res:any, next:any) => {};

App.use(errorHandler);

App.use(AppConfigs.SERVER_PATH, (req: Request, res: Response) => {
    res.send('The coupon system APIs 🚗')
});

export default App;