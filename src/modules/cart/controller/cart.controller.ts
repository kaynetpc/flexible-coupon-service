import express from 'express';
import { CartService } from '../service/cart.service';
import { ResponseService } from '../../../response/response.service';
import { ICart } from '../interface/cart.interface';


const CartController = express.Router();

// list all cart
CartController.get('/', async (req: express.Request, res: express.Response) => {
    const {hasError, message, statusCode, data} = await CartService.listAllCart();
    ResponseService.send({data, message, response: res, hasError, statusCode});
    return;
})

export default CartController;