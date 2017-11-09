import { CourseMiniVo } from '../study/CourseMiniVo';
import { UserVo } from '../core/UserVo';
import { StudyParentCommentVo } from './StudyParentCommentVo';
//我的评论
export class UserCourseCommentVo {
    targetId: number;
    createTime: number;
    content: string;
    user: UserVo;
    targetType: number;
    studyCourseSuperMiniVo:CourseMiniVo;
    parentCommentVo: StudyParentCommentVo;
}