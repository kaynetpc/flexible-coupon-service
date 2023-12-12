import ResponseError from "./response.error.service";
import { ISendErrorResponse, ISendResponse } from "./response.interface";


export class ResponseService {
      static send<T>({data, message, response, statusCode, hasError}: ISendResponse<T>) {
        response.status(statusCode ?? 200).send({statusCode: statusCode ?? 200, message, hasError: hasError || false, data});
      }
      
      
      static sendError({error, response, errMsg}: ISendErrorResponse) {
        const nError = error as ResponseError;
        response.status(nError.status).send({statusCode: nError.status, message: errMsg || nError.message, hasError: true, data: null});
      }
}