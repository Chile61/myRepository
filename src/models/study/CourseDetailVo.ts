import {CourseMiniVo} from "./CourseMiniVo";
/**
 * Created by zxh on 2016/12/17.
 */
//课程详情
export class CourseDetailVo {
    courseId: number;
    title: string;
    columnName: string;
    description: string;
    competencyName: string;
    modTime: number;
    pubTime: number;
    price2Str: number;
    favoriteNum: number;
    appraiseNum: number;
    contents: string;
    courseComment: string;
    middleIcon: string;
    shareFlag: number;
    resTypeId: number;
    targetResTypeId: number;
    resName: string;
    pages: number;
    resUrl: string;
    downloadUrl: string;
    audioTime: number;
    hasFavrited: boolean;
    hasAppraised: boolean;
    hasReaded: boolean;
    shareUrl: string;
    courseShowFlag: string;
    recommendCourseList: Array<CourseMiniVo>;

    downloadState: number = 0;//本地下载的的状态,0:未下载;1,下载中;2,已下载

    constructor() {

    }
}
