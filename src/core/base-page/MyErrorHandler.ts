import { ErrorHandler,Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";

@Injectable()
export class MyErrorHandler implements ErrorHandler {
    constructor(public toastController: ToastController) {
        
    }
    handleError(error){
        //TODO 此处可以先写文件到本地，然后退出应用； 定时/网络切换/打开应用时 反馈回服务器
        console.error(error);
        let toast = this.toastController.create({
            message: error,
            duration: 15 * 1000
        });
        toast.present();
    }
}