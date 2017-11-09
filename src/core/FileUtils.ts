import {StorageUtil} from "./storage/StorageUtil";
import {Platform, ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";
/**
 * Created by zxh on 2017/2/6.
 */
declare var FileTransfer: any;
declare var cordova: any;
//文件工具类(包含上传下载)
@Injectable()
export class FileUtils {

    constructor(private stroageUtil: StorageUtil,
                private platform: Platform,
                private toastController: ToastController) {

    }

    getCordova() {
        if (this.platform.is('cordova')) {
            return cordova;
        }
    }

    getFileTransfer() {
        if (this.platform.is('cordova')) {
            return new FileTransfer();
        }
    }

    //外部存储 （SD 卡） 的根路径。（*安卓*、*黑莓 10*)
    getFileRootDirectory() {
        if (this.platform.is('android')) {
            return cordova.file.externalRootDirectory;
        }
    }

    //资料持久性和私有資料存储在內部记忆体使用的应用程式的沙箱內  在 iOS，此目录不与iCloud同步  (*iOS*、*安卓*、*黑莓 10*)
    getFileDataDirectory() {
        if (this.platform.is('android') || this.platform.is('ios')) {
            return cordova.file.dataDirectory;
        }
    }

    //保存应用同步 （例如到 iCloud） 的特定于应用程式的档。（*iOS*)
    getFileSyncedDataDirectory() {
        if (this.platform.is('ios')) {
            return cordova.file.syncedDataDirectory;
        }
    }

    download(obj: {url: string, body?: any, localPath: string, success?: any, error?: any, progress?: any}) {
        if (!obj.url || obj.url == '') {
            this.toast('下载地址为空');
            return;
        }
        if (!obj.localPath || obj.localPath == '') {
            this.toast('本地存储地址为空');
            return;
        }
        try {
            let ft = new FileTransfer();
            ft.download(obj.url, obj.localPath,
                (entry) => {
                    console.log('download success!');
                    if (obj.success) {
                        obj.success(entry);//获取本地存储的路径使用entry.toURL()
                    }
                },
                (error) => {
                    console.log('download error!');
                    if (error) {
                        // "download error source"  error.source
                        // "download error target"  error.target
                        // "download error code"    error.code
                        obj.error(error);
                    }
                },
                true,
                {
                    headers: obj.body ? obj.body : {}
                });
            ft.onprogress = (progressEvent) => {
                if (progressEvent.lengthComputable) {
                    if (obj.progress) {
                        //progressEvent.loaded 已下载量
                        //progressEvent.total 总需下载量
                        obj.progress(progressEvent);
                    }
                }
            };
        } catch (e) {
            console.log(e);
        }
    }

    upload(obj: {url: string, localPath: string, success?: any, error?: any, progress?: any}) {
        if (!obj.url || obj.url == '') {
            this.toast('上传地址为空');
            return;
        }
        if (!obj.localPath || obj.localPath == '') {
            this.toast('本地文件地址为空');
            return;
        }
        try {
            let options = {
                fileKey: 'file',
                headers: {
                    'X-Access-Token': this.stroageUtil.getAccessToken()
                }
            };
            let ft = new FileTransfer();
            ft.upload(obj.localPath, encodeURI(obj.url), (entry) => {
                    console.log('upload success!');
                    if (obj.success) {
                        obj.success(JSON.parse(entry.response));
                    }
                },
                (error) => {
                    console.log('upload error!');
                    if (error) {
                        // "upload error source"  error.source
                        // "upload error target"  error.target
                        // "upload error code"    error.code
                        obj.error(error);
                    }
                }, options);
            ft.onprogress = (progressEvent) => {
                if (progressEvent.lengthComputable) {
                    if (obj.progress) {
                        //progressEvent.loaded 已上传量
                        //progressEvent.total 总需上传量
                        obj.progress(progressEvent);
                    }
                }
            };
            // ft.abort();//中止上传
        } catch (e) {
            console.log(e);
        }
    }

    toast(msg: any) {
        let toast = this.toastController.create({
            message: msg,
            duration: 2 * 1000
        });
        toast.present();
    }
}
