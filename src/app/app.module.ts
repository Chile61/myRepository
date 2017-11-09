import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule } from "ionic-angular";
import { MyApp } from "./app.component";
import { StorageUtil } from "../core/storage/StorageUtil";
import { HttpUtil } from "../core/http/HttpUtil";
import { ApiUrls } from "../core/http/ApiUrls";
import { TabsPage } from "../pages/tabs/tabs";
import { IndexPage } from "../pages/index/index";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { UserCenterPage } from "../pages/user-center/user-center";
import { StudyModule } from "./modules/study.module";
import { EnterpriseModule } from "./modules/enterprise.module";
import { GameModule } from "./modules/game.module";
import { TaskModule } from "./modules/task.module";
import { MemberModule } from './modules/member.module';
import { Utils } from "../core/Utils";
import { ShowBigImgPage } from "../core/show-bigimg-page/show-bigimg-page";
import { EmojiUtils } from "../core/EmojiUtils";
import { MyErrorHandler } from '../core/base-page/MyErrorHandler';
import { RuntimeCompiler } from '@angular/compiler';
import { CircleModule } from './modules/circle.module';
import { LoginModule } from './modules/login.module';
import { DBUtils } from "../core/db/DBUtils";
import { CreateTableUtils } from "../core/db/CreateTableUtils";
import { FileUtils } from "../core/FileUtils";
import { DownloadService } from "../core/DownloadService";
import { IndexSlidesPage } from '../pages/index/index-slides/index-slides';
import { ThemeUtils } from '../core/ThemeUtils';

@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        IndexPage,
        IndexSlidesPage,
        LoginPage,
        HomePage,
        UserCenterPage,
        ShowBigImgPage
    ],
    imports: [
        IonicModule.forRoot(MyApp, {
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
            tabsHideOnSubPages: "true",
            backButtonText: '',
            swipeBackEnable: true,
        }, {
                links: [
                    { component: IndexPage, name: 'index', segment: 'index', },
                    { component: LoginPage, name: 'login', segment: 'login', defaultHistory: [IndexPage] },
                    { component: TabsPage, name: 'userIndex', segment: 'userIndex' }
                ]
            }), StudyModule, CircleModule, EnterpriseModule, GameModule, TaskModule, MemberModule, LoginModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        TabsPage,
        IndexPage,
        IndexSlidesPage,
        LoginPage,
        HomePage,
        UserCenterPage,
        ShowBigImgPage
    ],
    providers: [
        { provide: ErrorHandler, useClass: MyErrorHandler },
        StorageUtil,
        ApiUrls,
        HttpUtil,
        Utils,
        EmojiUtils,
        RuntimeCompiler,
        DBUtils,
        CreateTableUtils,
        FileUtils,
        DownloadService,
        ThemeUtils,
    ]
})
export class AppModule {
}


