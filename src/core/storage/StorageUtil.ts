/**
 * Created by zxh on 2016/12/16.
 */
import { ConfigKey } from './ConfigKey';
import { Injectable } from "@angular/core";
import {DBTableName} from "../db/DBTableName";
import {Platform} from "ionic-angular";
import {DBUtils} from "../db/DBUtils";

@Injectable()
export class StorageUtil {
    constructor(private platform: Platform,private dbUtils: DBUtils) {

    }

    public setStorageValue(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    public getStorageValue(key: string, defaultValue?: any) {
        return localStorage.getItem(key) || defaultValue || '';
    }

    public setStorageObject(key: string, object: any) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    public getStorageObject(key: string, defaultValue?: any) {
        return JSON.parse(this.getStorageValue(key) || defaultValue || '{}');
    }

    public saveLoginInfo(info: any) {
        localStorage.setItem(ConfigKey.ORG_CODE, info.orgCode);
        localStorage.setItem(ConfigKey.ORG_ID, info.orgId);
        localStorage.setItem(ConfigKey.USER_ID, info.userId);
        localStorage.setItem(ConfigKey.USERNAME, info.username);
        localStorage.setItem(ConfigKey.NICKNAME, info.nickname);
        localStorage.setItem(ConfigKey.ACCESS_TOKEN, info.accessToken);
        localStorage.setItem(ConfigKey.AVATAR, info.avatar);
        localStorage.setItem(ConfigKey.GENDER, info.gender);
    }

    public saveModuleConfig(moduleConfig: any) {
        this.setStorageObject(ConfigKey.MODULE_CONFIG, moduleConfig);
    }

    public getModuleConfig() {
        return this.getStorageObject(ConfigKey.MODULE_CONFIG, '[]');
    }

    public saveUserInfo(userMsg: any) {
        localStorage.setItem(ConfigKey.USER_MSG, JSON.stringify(userMsg));
    }
    public getUserInfo() {
        let val = this.getStorageValue(ConfigKey.USER_MSG);
        return JSON.parse(val);
    }
    public getOrgCode(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.ORG_CODE, defaultValue);
    }

    public getOrgId(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.ORG_ID, defaultValue);
    }

    public getUserName(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.USERNAME, defaultValue);
    }

    public getUserId(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.USER_ID, defaultValue);
    }

    public getUserAvatar(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.AVATAR, defaultValue);
    }

    public getUserGender(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.GENDER, defaultValue);
    }

    public getAccessToken(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.ACCESS_TOKEN, defaultValue);
    }

    public getPersonGrpId(defaultValue?: any) {
        return this.getStorageValue(ConfigKey.PERSON_GRP_ID, defaultValue);
    }

    public clearStorageValue(key: string) {
        localStorage.removeItem(key);
    }

    // 退出登录清除localStorage的某些内容
    public loginOut() {
        // localStorage.clear();
        this.clearStorageValue(ConfigKey.ORG_ID);
        this.clearStorageValue(ConfigKey.USER_ID);
        this.clearStorageValue(ConfigKey.USERNAME);
        this.clearStorageValue(ConfigKey.NICKNAME);
        this.clearStorageValue(ConfigKey.ACCESS_TOKEN);
        this.clearStorageValue(ConfigKey.AVATAR);
        this.clearStorageValue(ConfigKey.GENDER);
        this.clearStorageValue(ConfigKey.PERSON_GRP_ID)

        this.clearStorageValue(ConfigKey.MODULE_CONFIG);

        this.clearStorageValue(ConfigKey.USER_MSG);

        this.clearStorageValue(ConfigKey.STUDY_COURSE_APPRAISE);
        this.clearStorageValue(ConfigKey.STUDY_COURSE_COLLECT);
        this.clearStorageValue(ConfigKey.STUDY_COURSE_DOWNLOAD);
        this.clearStorageValue(ConfigKey.COURSE_COMMENT_MAX);
        this.clearStorageValue(ConfigKey.COURSE_COMMENT_REPLY_MAX);

        //删除已读课程表
        this.platform.ready().then(() => {
            if (this.platform.is('mobile')) {
                this.dbUtils.deleteTab({tableName: DBTableName.READ_COURSE_TABLE});
            }
        });
    }
}
