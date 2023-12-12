import { Response } from "express";

export interface IResponseService<T> {
    statusCode: number;
    hasError: boolean;
    message: string;
    data: T | T[];
}

export interface ISendResponse<T> {
    response: Response, 
    data: T | T[],
    message: string,
    statusCode?: number,
    hasError?: boolean
  }


  export interface ISendErrorResponse {
    response: Response,
    error: unknown,
    errMsg?: string
  }