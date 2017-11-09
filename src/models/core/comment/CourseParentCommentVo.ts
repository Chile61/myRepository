import {UserVo} from "../UserVo";
/**
 * Created by zxh on 2016/12/17.
 */
//课程形式上级评论
export class CourseParentCommentVo {
    commentId: number;
    content: string;
    hits: string;
    createTime: number;
    user: UserVo;
}
