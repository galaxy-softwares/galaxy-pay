import { Injectable } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayRequestParam } from "../interfaces/base.interface";

@Injectable()
export class AliPagePayService extends AliPayBaseService {

    /**
     * 
     * 支付宝pc支付
     * @param param AlipayRequestParam
     * @param private_key srting
     */
    pay(param: AlipayRequestParam, private_key: string){
        return this.processParams(param, private_key);
    }
}