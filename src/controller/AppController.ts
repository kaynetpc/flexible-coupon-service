import express from 'express';
import CartController from '../modules/cart/controller/cart.controller';
import CouponController from '../modules/coupon/controller/coupon.controller';


const AppController = express.Router();
// Cart
AppController.use('/cart', CartController)

// Coupon
AppController.use('/coupon', CouponController)

export default AppController;