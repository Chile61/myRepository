import {Injectable} from "@angular/core";

 @Injectable()
export class Utils {

    constructor() {

    }

    // 手机号码正则匹配
    public isPhoneNumber(phoneNo: string) {
        return (/^1[34578]\d{9}$/.test(phoneNo));
    }
    //字符串是否为空
    public isStringNull(data: string){
        if(data==null||data==''){
            return true;
        }else{
            return false;
        }
    }
}
