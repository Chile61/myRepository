import { FileUtils } from './FileUtils';
import { AppThemeConfigVo } from '../models/core/AppThemeConfigVo';
import { Injectable } from '@angular/core';
import { StorageUtil } from './storage/StorageUtil';
import { ConfigKey } from './storage/ConfigKey';
import { ToastController, Platform } from 'ionic-angular';


@Injectable()
export class ThemeUtils {
    DEFAULT_THEME = '#158be0';
    constructor(private storageUtile: StorageUtil,
        private fileUtils: FileUtils,
        private toast: ToastController,
        private platform: Platform, ) {

    }
    //保存主题色
    saveTheme(configValue: any) {
        if (!configValue.orgTheme || configValue.orgTheme == '') {
            this.storageUtile.setStorageValue(ConfigKey.THEME_VALUE, this.DEFAULT_THEME);
            this.storageUtile.setStorageValue(ConfigKey.THEME_IMAGE, null);
        } else {
            let appThemeConfigVo: AppThemeConfigVo = configValue.orgTheme;
            if (appThemeConfigVo.themeValue) {
                this.storageUtile.setStorageValue(ConfigKey.THEME_VALUE, appThemeConfigVo.themeValue);
            } else {
                this.storageUtile.setStorageValue(ConfigKey.THEME_VALUE, this.DEFAULT_THEME);
            }
            if (appThemeConfigVo.themeImage && JSON.stringify(appThemeConfigVo.themeImage) != '{}') {
                let urls: string = appThemeConfigVo.themeImage["127*1080"];
                let localPath = '';
                let fileName = 'themeImage.png';
                if (this.platform.is('android')) {
                    localPath = this.fileUtils.getFileRootDirectory() + 'Android/data/com.ionicframework.schohybridsaas364607/download/' + fileName;
                } else if (this.platform.is('ios')) {
                    localPath = this.fileUtils.getFileDataDirectory() + fileName;
                }
                this.fileUtils.download({
                    url: urls,
                    localPath: localPath,
                    success: (res) => {
                        this.storageUtile.setStorageValue(ConfigKey.THEME_IMAGE, res.toURL());
                    },
                    error: (res) => {
                        this.storageUtile.setStorageValue(ConfigKey.THEME_IMAGE, null);
                    }
                });
            } else {
                this.storageUtile.setStorageValue(ConfigKey.THEME_IMAGE, null);
            }
        }
    }
    //检查是否有主题图片背景
    checkIsHaveThemePicture() {
        return this.storageUtile.getStorageValue(ConfigKey.THEME_IMAGE) ? false : true;
    }
    //获取主题图片背景
    getThemePicture() {
        return this.storageUtile.getStorageValue(ConfigKey.THEME_IMAGE);
    }
    //获取主题色
    getThemeColor() {
        return this.storageUtile.getStorageValue(ConfigKey.THEME_VALUE);
    }
    //设置tabs主题色
    setTabThemeColor() {

    }
}