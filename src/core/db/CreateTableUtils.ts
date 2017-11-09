/**
 * Created by zxh on 2017/2/4.
 */
import {Injectable} from "@angular/core";
import {DBUtils} from "./DBUtils";
import {DBTableName} from "./DBTableName";
import {Platform} from "ionic-angular";

//统一创建表工具类
@Injectable()
export class CreateTableUtils {

    constructor(private dbUtils: DBUtils,
                private platform: Platform) {
        //下载表未创建则创建
        this.platform.ready().then(()=>{
            if (this.platform.is('mobile')) {
                this.dbUtils.tabIsExist(DBTableName.DOWNLOAD_COURSE_TABLE).then((isExist) => {
                    if (isExist == false) {
                        this.createDownloadCourseTable();
                    }
                });
            }
        });
    }

    //创建已读课程表
    createReadCourseTable() {
        this.dbUtils.createTable({
            tableName: DBTableName.READ_COURSE_TABLE,
            columns: [{
                column: 'courseId',
                dataType: 'INTEGER PRIMARY KEY'
            }],
            success: () => {
                console.log('创建成功');
            },
            error: (error) => {
                console.log(error.message);
            }
        });
    }

    createDownloadCourseTable(){
        this.dbUtils.createTable({
            tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
            columns: [{
                column: 'userId',
                dataType: 'TEXT'
            },{
                column: 'courseId',
                dataType: 'INTEGER'
            },{
                column: 'downloadState',
                dataType: 'INTEGER'
            },{
                column: 'downloadLocalPath',
                dataType: 'TEXT'
            },{
                column: 'courseDetail',
                dataType: 'TEXT'
            }],
            success: () => {
                console.log('创建成功');
            },
            error: (error) => {
                console.log(error.message);
            }
        });
    }

}
