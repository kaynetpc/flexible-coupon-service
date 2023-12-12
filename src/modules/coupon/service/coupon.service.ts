import { Request, Response } from "express";
import { CouponModel, DiscountType, IDiscounts } from "../model/coupon.model";
import { IResponseService } from "../../../response/response.interface";
import ResponseError from "../../../response/response.error.service";
import { AppConfigs } from "../../../config/app";
import { ICart } from "../../cart/interface/cart.interface";
import { cartItems } from "../../cart/service/dummy.data";

const isDev = AppConfigs.IS_DEV
export class CouponService {

    // Create a new coupon
    static createCoupon = async (payload: any): Promise<IResponseService<CouponModel>> => {
        try {
          const discounts: IDiscounts = payload?.discounts
          if(!payload?.code || !payload?.rules || !payload?.discounts) {
            return {hasError: true, message: 'Invalid payload', statusCode: 400, data: {} as CouponModel};
          }


          // check if code already exist
          const isExist = await CouponModel.findOne({where: {code: payload?.code.toLowerCase()}})

          payload.code = payload?.code.toLowerCase();

          if(isExist) {
            return {hasError: false, message: `${payload?.code} already exist`, statusCode: 200, data: {} as CouponModel};
          }

          if (!Object.values(DiscountType).includes(discounts.type)) {
            return {hasError: true, message: `Invalid discount type, here are the supported DiscountType: ${DiscountType.FIXED_AMOUNT}, ${DiscountType.MIXED}, ${DiscountType.PERCENT}`, statusCode: 400, data: {} as CouponModel};
          }
          
          // Validate payload based on discount type
          switch (discounts.type) {
                  case DiscountType.FIXED_AMOUNT: 
                  if (typeof discounts.amount !== 'number') {
                    return {hasError: true, message: 'Invalid payload for FIXED_AMOUNT discount type, "amount" is required!', statusCode: 400, data: {} as CouponModel};
                  } 
              break;
            case DiscountType.PERCENT: {
                if (typeof discounts.percent !== 'number') {
                  return {hasError: true, message: 'Invalid payload for PERCENT discount type', statusCode: 400, data: {} as CouponModel};
                }
                const inValidRange = (discounts.percent > 0 && discounts.percent <= 100)
                if (!inValidRange) {
                  return {hasError: true, message: 'Invalid payload for PERCENT range. percentage should be between 0.1 to 100 type, "amount" is required!', statusCode: 400, data: {} as CouponModel};
                }
              }
              break;
            case DiscountType.MIXED: {
              if (typeof discounts.amount !== 'number' || typeof discounts.percent !== 'number') {
                return {hasError: true, message: 'Invalid payload for MIXED discount type', statusCode: 401, data: {} as CouponModel};
              }

              const inValidRange = (discounts.percent > 0 && discounts.percent <= 100)
                if (!inValidRange) {
                  return {hasError: true, message: 'Invalid payload for PERCENT range. percentage should be between 0.1 to 100 type, "amount" is required!', statusCode: 400, data: {} as CouponModel};
                }

            }
              break;
            default:
              return {hasError: true, message: `Invalid discount type, here are the supported DiscountType: ${DiscountType.FIXED_AMOUNT}, ${DiscountType.MIXED}, ${DiscountType.PERCENT}`, statusCode: 400, data: {} as CouponModel};              
          }

          console.log('the payload ', payload)
          const res = await CouponModel.create(payload);
          
          return {hasError: false, message: 'Success', statusCode: 201, data: res};
        } catch (error) {
            isDev && console.error(error);
            const err = ResponseError.get(error)
            return {hasError: true, message: err?.message || 'Internal Server Error', statusCode: err.status, data: {} as CouponModel}
            
        }
    };
    
    // Get all coupons
    static getAllCoupons = async (): Promise<IResponseService<CouponModel>> => {
        try {
            const res = await CouponModel.findAll();
            return {hasError: false, message: 'Success', statusCode: 200, data: res};
        } catch (error) {
            isDev && console.error(error);
            const err = ResponseError.get(error)
            return {hasError: true, message: err?.message || 'Internal Server Error', statusCode: err.status, data:[]}
        }
    };
    
    // Get a specific coupon by code
    static getCouponByCode = async (code: string): Promise<IResponseService<CouponModel | null>> => {
        
        try {
          console.log('he code    ', code)
          const coupon = await CouponModel.findOne({where: { code: code.toLowerCase() }});
            
            if (!coupon) {
                return {hasError: true, message: 'Coupon not found', statusCode: 404, data: null };
            }
            return {hasError: false, message: 'Success', statusCode: 200, data: coupon };      
        } catch (error) {
          isDev && console.error(error);
          const err = ResponseError.get(error)
          return {hasError: true, message: err?.message || 'Internal Server Error', statusCode: err.status, data: null}
        }
      };

    // Apply a coupon to a cart
    static applyCoupon = async (code: string): Promise<IResponseService<any>> => {
        
        try {
            const coupon = await CouponModel.findOne({where: {code: code.toLowerCase()}});

            if(!coupon) {
              return {hasError: true, message: 'Coupon not found', statusCode: 404, data: null };
            }

            // get items i cart list assumed user logged in and cart can easily be retrieve
            const loggedInUserCart: ICart[] = cartItems


            const cartItemCount = loggedInUserCart.length;

            const cartTotal = loggedInUserCart.reduce((sum, cur) => sum  + cur.price, 0)

          // Check coupon validity based on rules
          const isValid = checkCouponValidity(coupon, cartTotal, cartItemCount);

          if (!isValid) {
            return {hasError: true, message: 'Coupon not applicable', statusCode: 404, data: null}
          }

          // Calculate adjusted price and discount amount
          const { adjustedPrice, discountAmount } = calculateDiscount(coupon, cartTotal);

          const result = { originalPrice: cartTotal, discountAmount, adjustedPrice };

          return {data: result, hasError: false, message: 'Success', statusCode: 200}   
        } catch (error) {
          isDev && console.error(error);
          const err = ResponseError.get(error)
          return {hasError: true, message: err?.message || 'Internal Server Error', statusCode: err.status, data: null}
        }
      };

      
    static deleteCoupon = async (code: string): Promise<IResponseService<CouponModel | null>> => {
        
        try {
            const isExist = await CouponModel.findOne({
                where: { code },
              });

              if (!isExist) {
                return {hasError: true, message: 'Coupon not found', statusCode: 404, data: null };      
              }
            const result = await CouponModel.destroy({  where: { code } });

            console.log(result)
          
          
            return {hasError: false, message: 'Deleted', statusCode: 200, data: null };      
        } catch (error) {
          isDev && console.error(error);
          const err = ResponseError.get(error)
          return {hasError: true, message: err?.message || 'Internal Server Error', statusCode: err.status, data: null}
        }
      };
}






// Helper function to check coupon validity
const checkCouponValidity = (coupon: CouponModel, cartTotal: number, cartItemCount: number,) => {
  // coupon validity checks based on rules

  const rules = coupon.rules

  const mustCount = rules?.itemCount || 1
  const meetMustCount = mustCount? (cartItemCount >= mustCount): true;

  const minimumPrice = rules?.totalPrice
  const meetMinimumPrice = minimumPrice? (cartTotal >= minimumPrice): true;

  const isValid = meetMustCount && meetMinimumPrice;

  return isValid;
};

// Helper function to calculate discount
const calculateDiscount = (coupon: CouponModel, cartTotal: number) => {
  const discounts = coupon.discounts;

  isDev &&  console.log(discounts)
  switch(discounts.type) {
    case DiscountType.FIXED_AMOUNT: 
      {
        const discount = (discounts?.amount || 0);
        const amount = calculateFixedAmountDiscount(cartTotal, 5000)
        console.log('::::::::::::::::::;______', cartTotal, calculateFixedAmountDiscount(cartTotal, discount))
        return { adjustedPrice: amount, discountAmount: discount };
      }
    case DiscountType.PERCENT: 
      {
        const percentage = discounts?.percent || 0;
        const discount = calculatePercentDiscount(cartTotal, percentage);
        const amount = cartTotal - discount
        return { adjustedPrice: amount, discountAmount: discount }
      }
    case DiscountType.MIXED: 
      {
        const fixedAmountDiscount = calculateFixedAmountDiscount(cartTotal, discounts?.amount || 0);
        const percentDiscount = cartTotal - calculatePercentDiscount(cartTotal, discounts?.percent || 0);
        const discount = Math.max(fixedAmountDiscount, percentDiscount);
        console.log('--------------', {percentDiscount, discount})
        return { adjustedPrice: discount, discountAmount: cartTotal - discount}
      }
    default: return { adjustedPrice: cartTotal, discountAmount: 0 }
  }
};

const calculateFixedAmountDiscount = (cartTotal: number, amount: number): number => {
  return Math.max(0, cartTotal - amount);
};

const calculatePercentDiscount = (cartTotal: number, percent: number): number => {
  return (cartTotal * percent) / 100;
};
