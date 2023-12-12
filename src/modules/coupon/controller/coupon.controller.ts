import express from 'express';
import { CouponService } from '../service/coupon.service';
import { ResponseService } from '../../../response/response.service';

const CouponController = express.Router();

// Create 
CouponController.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const {hasError, message, statusCode, data} = await CouponService.createCoupon(req?.body);
        ResponseService.send({hasError, message, statusCode, data, response: res})
        return;        
    } catch (error) {
        ResponseService.sendError({error, response: res})
        return;        
        
    }
})

//  get all coupon or by code
CouponController.get('/', async (req: express.Request, res: express.Response) => {
    const { code } = req.query;
    
    if(code) {
        const {hasError, message, statusCode, data} = await CouponService.getCouponByCode(code+'');
        ResponseService.send({hasError, message, statusCode, data, response: res})
        return;
    }
    const {hasError, message, statusCode, data} = await CouponService.getAllCoupons();
    ResponseService.send({hasError, message, statusCode, data, response: res})
    return;
})

//  get a coupon by code
CouponController.get('/:code', async (req: express.Request, res: express.Response) => {
    const { code } = req.params;
    const {hasError, message, statusCode, data} = await CouponService.getCouponByCode(code+'');
    ResponseService.send({hasError, message, statusCode, data, response: res})
    return;
})

//  delete a coupon by code
CouponController.delete('/:code', async (req: express.Request, res: express.Response) => {
    const { code } = req.params;
    const {hasError, message, statusCode, data} = await CouponService.deleteCoupon(code+'');
    ResponseService.send({hasError, message, statusCode, data, response: res})
    return;
})

//  Apply coupon
CouponController.post('/:code', async (req: express.Request, res: express.Response) => {
    const { code } = req.params;
    const {hasError, message, statusCode, data} = await CouponService.applyCoupon(code+'');
    ResponseService.send({hasError, message, statusCode, data, response: res})
    return;
})

export default CouponController;