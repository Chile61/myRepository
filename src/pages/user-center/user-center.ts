import {OfflineDownloadPage} from './offline-download/offline-download';
import {Component, Injector} from "@angular/core";
import {NavController, Platform} from "ionic-angular";
import {MyApp} from "../../app/app.component";
import {BasePage} from "../../core/base-page/BasePage";
//import { MemberInfoPage } from './member-info/member-info';
import {MemberGroupPage} from './member-group/member-group';
import {MoreHomePage} from './more/more-home/more-home';
import {MemberIntegralPage} from './member-integral/member-integral';
import {MemberCollectionPage} from './member-collection/member-collection';
import {MemberCommentsPage} from './member-comments/member-comments';
import {MemberRankPage} from './member-rank/member-rank';
import {UserVo} from '../../models/userCenter/UserVo';
import {MemberStatisticsPage} from './member-statistics/member-statistics';
import {MemberHistoryPage} from './member-history/member-history';
import {MemberPage} from './member/member';
import {MemberInfoPage} from './member-info/member-info';
import {DBUtils} from "../../core/db/DBUtils";
import {DBTableName} from "../../core/db/DBTableName";
import { ConfigKey } from '../../core/storage/ConfigKey';
import { LoginPage } from '../login/login';



@Component({
    selector: 'page-user-center',
    templateUrl: 'user-center.html'
})
export class UserCenterPage extends BasePage {
    public userVo: UserVo;
    public userModule: any;
    public oldUserId: number;

    constructor(injector: Injector,
                public navCtrl: NavController,
                private platform: Platform,
                private dbUtils: DBUtils) {
        super(injector);
        this.getUserModuleConfig();

        this.showLoading('请稍后...');
        this.getMyInfo();
    }

    //每次进入
    ionViewWillEnter() {
        console.log('refresh');
        this.oldUserId=this.storageUtil.getUserId();
        this.userVo = this.storageUtil.getUserInfo();
    }

    //用户模块配置
    getUserModuleConfig() {
        let moduleConfig = this.storageUtil.getModuleConfig();
        console.log(moduleConfig);
        for (let i in moduleConfig) {
            let itemConfig = moduleConfig[i];
            if (itemConfig.moduleCode == 'MODEL_CONFIG_MINE') {
                let moduleConfgs = itemConfig.modulePageConfgs;
                for (let temp in moduleConfgs) {
                    if (moduleConfgs[temp].pageCode == 'MODEL_CONFIG_MINE_PAGE') {
                        this.userModule = moduleConfgs[temp].modulePageItemConfgs
                    }
                }
            }
        }
    }

    //我的信息
    getMyInfo() {
        let body = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId()
        };
        this.httpUtil.get({
            url: this.apiUrls.getMyInfo(),
            param: body,
            success: (data) => {
                //this.log(data);
                this.storageUtil.saveUserInfo(data.result);
                this.userVo = data.result;
                console.log(this.userVo);
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        })
    }

    //进入个人信息页
    enterMemberInfo() {
        this.navController.push(MemberInfoPage);
    }

    //进入已学课程页
    enterMemberHistory() {
        this.navController.push(MemberHistoryPage);
    }

    //进入排行榜
    enterMemberRank() {
        this.navController.push(MemberRankPage);
    }

    //进入学习统计页
    enterMemberStatistics() {
        this.navController.push(MemberStatisticsPage);
    }

    //进入人群切换
    enterMemberGroup() {
        this.navController.push(MemberGroupPage);
    }

    //离线下载
    enterOfflineDownload() {
        this.navController.push(OfflineDownloadPage);
    }

    //进入用户评论
    enterMemberComments() {
        this.navController.push(MemberCommentsPage);
    }

    //进入用户收藏
    enterMemberCollection() {
        this.navController.push(MemberCollectionPage);
    }

    //进入我的积分
    enterMemberIntegral() {
        this.navController.push(MemberIntegralPage);
    }

    //进入更多
    enterMorePage() {
        this.navController.push(MoreHomePage);
    }

    //退出
    logout() {
        let orgCode = 'tester';
        this.storageUtil.loginOut();
        this.storageUtil.setStorageValue(ConfigKey.OLD_USER_ID,this.oldUserId);
        console.log('LOGOUT',this.navCtrl.length());
        //this.navCtrl.popTo(IndexPage);
        //this.navCtrl.popToRoot();
        //this.navCtrl.setRoot('');
        //this.navCtrl.push(MyApp);
        this.navCtrl.push(LoginPage);

        // window.location.replace('#/MyApp');
    }

}
