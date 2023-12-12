import ResponseError from "../../../response/response.error.service"
import { IResponseService } from "../../../response/response.interface"
import { ICart } from "../interface/cart.interface"
import { cartItems } from "./dummy.data"

let list: any[] = []
export class CartService {
    

    static listAllCart = (): IResponseService<any> => {
        try {

            return {message: "All items in cart", hasError: true, statusCode: 200, data: cartItems}
            
        } catch (error) {
            const err = ResponseError.get(error)
            return {hasError: true, message: err?.message || 'Internal server error', statusCode: err.status, data: null}
        }
    }

}