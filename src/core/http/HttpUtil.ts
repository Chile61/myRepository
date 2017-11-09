import "rxjs/add/operator/map";
import {Injectable} from "@angular/core";
import {StorageUtil} from "../storage/StorageUtil";
import {Http, Headers, RequestOptions} from "@angular/http";
import { Constants } from '../Constants';
import { Events } from 'ionic-angular';

@Injectable()
export class HttpUtil {

    constructor(public http: Http, public storageUtil: StorageUtil, public events:Events) {

    }

    public post(obj: {url: string, param?: any, success?: any, fail?: any, finish?: any}) {
        let token = this.storageUtil.getAccessToken();
        let header = new Headers({'X-Access-Token': token});
        let options = new RequestOptions({headers: header});
        this.http.post(obj.url, obj.param, options).map(res => res.json()).subscribe((res) => {
            if (res && res.code == 0) {
                if (obj.success != null) {
                    obj.success({
                        result: res.result,
                        msg: res.msg,
                        totalCount: res.totalCount
                    });
                }
            } else {
                if (obj.fail != null) {
                    obj.fail({
                        isNetworkError: false,
                        code: res.errorCode,
                        msg: res.msg
                    });
                }
            }
            if (obj.finish != null) {
                obj.finish();
            }
        }, (err) => {
            if(err.status == Constants.LOGIN_OUT_STATUS_CODE){
                this.backToLogin(err);
            }else{
                if (obj.fail != null) {
                    obj.fail({
                        isNetworkError: true,
                        code: err.status,
                        msg: '网络请求异常'
                    });
                }
            }
            if (obj.finish != null) {
                obj.finish();
            }
        });
    }

    public get(obj: {url: string, param?: any, success?: any, fail?: any, finish?: any}) {
        let token = this.storageUtil.getAccessToken();
        let header = new Headers({'X-Access-Token': token});
        let searchStr: string = "";
        if (obj.param) {
            for (let k in obj.param) {
                let v = obj.param[k];
                searchStr += k + '=' + v + '&';
            }
            searchStr = searchStr.substr(0, searchStr.length - 1)
        }
        let options = new RequestOptions({headers: header, search: searchStr});
        this.http.get(obj.url, options).map(res => res.json()).subscribe((res) => {
            if (res && res.code == 0) {
                if (obj.success != null) {
                    obj.success({
                        result: res.result,
                        msg: res.msg,
                        totalCount: res.totalCount
                    });
                }
            } else {
                if (obj.fail != null) {
                    obj.fail({
                        isNetworkError: false,
                        code: res.errorCode,
                        msg: res.msg
                    });
                }
            }
            if (obj.finish != null) {
                obj.finish();
            }
        }, (err) => {
            if(err.status == Constants.LOGIN_OUT_STATUS_CODE){
                this.backToLogin(err);
            }else{
                if (obj.fail != null) {
                    obj.fail({
                        isNetworkError: true,
                        code: err.status,
                        msg: '网络请求异常'
                    });
                }
            }
            if (obj.finish != null) {
                obj.finish();
            }
        });
    }
    backToLogin(err:any){//退出登录
        this.storageUtil.loginOut();//清除登录信息
        this.events.publish(Constants.LOGIN_EVENT,JSON.parse(err._body).msg);
    }
}
