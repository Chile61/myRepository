import {Injectable} from "@angular/core";
import {CourseDetailVo} from "../models/study/CourseDetailVo";
import {Events} from "ionic-angular";
/**
 * Created by zxh on 2017/2/8.
 */
//课程下载任务
@Injectable()
export class DownloadService {

    private downloadCourseTask: any = [];

    constructor(private events: Events) {

    }

    addCourseDownloadTask(courseDetail: CourseDetailVo, progress: any) {
        for (let i = 0; i < this.downloadCourseTask.length; i++) {
            if (this.downloadCourseTask[i].courseDetail.courseId == courseDetail.courseId) {
                if (progress.loaded / progress.total == 1) {
                    this.deleteCourseDownloadTask(i);
                } else {
                    this.downloadCourseTask[i].progress = progress;
                }
                return;
            }
        }
        this.downloadCourseTask.push({courseDetail: courseDetail, progress: progress});
    }

    deleteCourseDownloadTask(index: number) {
        this.events.publish('courseDownloaded', this.downloadCourseTask[index].courseDetail);
        this.downloadCourseTask.splice(index, 1);
    }

    getCourseDownloading() {
        return this.downloadCourseTask;
    }

}
