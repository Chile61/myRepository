import {StudyHomePage} from "../study/study-home/study-home";
import {Component, Injector} from "@angular/core";
import {UserCenterPage} from "../user-center/user-center";
import {EnterprisePage} from "../enterprise/enterprise-home/enterprise-home";
import {BasePage} from "../../core/base-page/BasePage";
import {CircleHomePage} from "../circle/circle-home/circle-home";
import {DBTableName} from "../../core/db/DBTableName";
import {CreateTableUtils} from "../../core/db/CreateTableUtils";
import {DBUtils} from "../../core/db/DBUtils";
import {Platform} from "ionic-angular";
/*
  Generated class for the Tabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage extends BasePage {
    public configModules: {moduleCode: string} = {moduleCode: ''};
    //学习
    public MODEL_CONFIG_STUDY: "MODEL_CONFIG_STUDY";
    //圈子
    public MODEL_CONFIG_COMMUNITY: "MODEL_CONFIG_COMMUNITY";
    //企业
    public MODEL_CONFIG_COMPANY: "MODEL_CONFIG_COMPANY";
    //个人
    public MODEL_CONFIG_MINE: "MODEL_CONFIG_MINE";


    tab1 = StudyHomePage;
    tab2 = CircleHomePage;
    tab3 = EnterprisePage;
    tab4 = UserCenterPage;

    constructor(injector: Injector,
                private dbUtils: DBUtils,
                private createTableUtils: CreateTableUtils,
                private platform: Platform) {
        super(injector);
        //this.showLoading();
        this.getUserReadCourse();
        this.configModules = this.storageUtil.getModuleConfig();

    }

    ionViewDidLoad() {
        console.log('Hello TabsPage Page');
    }

    //获取用户已读课程
    getUserReadCourse() {
        this.platform.ready().then(()=>{
            if (this.platform.is('mobile')) {
                this.dbUtils.tabIsExist(DBTableName.READ_COURSE_TABLE).then((isExist) => {
                    if (isExist == false) {
                        //调用接口获取已读课程ID
                        this.createTableUtils.createReadCourseTable();
                        let url = this.apiUrls.getUrlReadCourseId();
                        let params = {
                            orgId: this.storageUtil.getOrgId(),
                            userId: this.storageUtil.getUserId()
                        };
                        this.httpUtil.get({
                            url: url, param: params, success: (res) => {
                                if (res.result == null || res.result == '') {
                                    return;
                                }
                                let courseIds = [{courseId: ''}];
                                for (let i = 0; i < res.result.length; i++) {
                                    courseIds[i] = {courseId: res.result[i]};
                                }
                                this.dbUtils.insertAll({tableName: DBTableName.READ_COURSE_TABLE, datas: courseIds});
                            }
                        });
                    }
                });
            }
        });
    }

}
