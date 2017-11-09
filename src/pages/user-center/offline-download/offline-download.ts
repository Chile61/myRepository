import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {DownloadService} from "../../../core/DownloadService";
import {DBUtils} from "../../../core/db/DBUtils";
import {Platform, Events} from "ionic-angular";
import {DBTableName} from "../../../core/db/DBTableName";
import {CourseDetailPage} from "../../study/course-detail/course-detail";
import {Constants} from "../../../core/Constants";
import {CategoryUtils} from "../../study/CategoryUtils";
/**
 * Created by zxh on 2017/2/8.
 */
@Component({
    selector: 'offline-download-page',
    templateUrl: 'offline-download.html'
})
//离线下载
export class OfflineDownloadPage extends BasePage {

    public downloadState = 'downloaded';

    public courseList: any = [];//已下载课程
    public downloadingCourseList: any = [];//下载中课程

    private getDownloadingID: any;

    constructor(injector: Injector,
                private dbUtils: DBUtils,
                private platform: Platform,
                private downloadService: DownloadService,
                private events: Events) {
        super(injector);
        this.getDownloaded();
        this.getDownloading();
        this.events.subscribe('courseDownloaded', (date) => {
            if (date && date.length > 0) {
                this.courseList.push(date[0]);
            }
        });
    }

    //获取已下载课程
    getDownloaded() {
        this.platform.ready().then(() => {
            if (this.platform.is('mobile')) {
                this.dbUtils.selectByWhere({
                    tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
                    where: 'userId="' + this.storageUtil.getUserId() + '"',
                    success: (response) => {
                        if (response && response.length > 0) {
                            for (let i = 0; i < response.length; i++) {
                                if (response[i].downloadState == 2) {
                                    this.courseList.push(JSON.parse(response[i].courseDetail));
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    //获取正在下载中的课程
    getDownloading() {
        this.platform.ready().then(() => {
            if (this.platform.is('mobile')) {
                this.getDownloadingID = setInterval(() => {
                    this.downloadingCourseList = this.downloadService.getCourseDownloading();
                }, 1000);
            }
        });
    }

    //删除下载课程
    deleteDownloaded(index: number) {
        let courseDetail = this.courseList[index];
        this.courseList.splice(index, 1);
        this.platform.ready().then(() => {
            if (this.platform.is('mobile')) {
                this.dbUtils.delete({
                    tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
                    where: 'userId="' + this.storageUtil.getUserId() + '" AND courseId=' + courseDetail.courseId
                });
            }
        });
    }

    //获取能力标签Css样式
    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //跳转到课程详情
    toCourseDetail(index: number) {
        this.navController.push(CourseDetailPage, {
            courseId: this.courseList[index].courseId,
            courseDetail: this.courseList[index],
            fromWhere: Constants.FROM_OFFLINE_DOWNLOAD
        });
    }

    //界面销毁
    ionViewWillUnload() {
        clearInterval(this.getDownloadingID);
        this.events.unsubscribe('courseDownloaded');
    }

}
