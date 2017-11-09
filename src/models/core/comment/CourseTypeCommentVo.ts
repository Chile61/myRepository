import {CourseParentCommentVo} from "./CourseParentCommentVo";
import {UserVo} from "../UserVo";
/**
 * Created by zxh on 2016/12/17.
 */
//课程形式评论
export class CourseTypeCommentVo {
    commentId: string;
    content: string;
    awesomeCount: number;
    createTime: number;
    parentCommentVo: CourseParentCommentVo;
    hasAppraised: boolean;
    user: UserVo;
}
