import { TaskPage } from '../pages/enterprise/task/task';
import { Component} from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { IndexPage } from '../pages/index/index';
import { StorageUtil } from '../core/storage/StorageUtil';

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

    // the root (or first) page
    rootPage: any = IndexPage;

    constructor(public platform: Platform,public storageUitl:StorageUtil) {
        this.initializeApp();
        this.isLogin();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

        });
    }
    isLogin() {
        let userId = this.storageUitl.getUserId();
        let orgId = this.storageUitl.getOrgId();
        let accessToken = this.storageUitl.getAccessToken();
        console.log('userId:'+userId+"orgId:"+orgId+"accessToken"+accessToken);
        if( userId && orgId && accessToken ){
            this.rootPage = TabsPage;
        }

    }
}
