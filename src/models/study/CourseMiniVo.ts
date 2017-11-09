/**
 * Created by zxh on 2016/12/14.
 */
//课程列表对象
export class CourseMiniVo {
    courseId: number;
    title: string;
    smallIcon: string;
    commentNum: number;
    columnName: string;
    description: string;
    competencyName: string;
    modTime: number;
    pubTime: number;
    price2Str: number;
    favoriteNum: number;
    appraiseNum: number;

    isSelecter: boolean = false;//是否被选择，选择课程时使用
    isRead: boolean = false;//是否已读，本地置灰使用

    constructor() {

    }
}
