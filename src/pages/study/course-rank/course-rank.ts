/**
 * Created by zxh on 2016/12/22.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {CourseAppraiseRankPage} from "./appraise-course-rank/appraise-course-rank";
import {CourseFavoriteRankPage} from "./favorite-course-rank/favorite-course-rank";
import {CourseCommentRankPage} from "./comment-course-rank/comment-course-rank";

@Component({
    selector: 'page-course-rank',
    templateUrl: 'course-rank.html'
})

//课程排行
export class CourseRankPage extends BasePage {

    public tab1 = CourseCommentRankPage;
    public tab2 = CourseFavoriteRankPage;
    public tab3 = CourseAppraiseRankPage;

    constructor(injector: Injector) {
        super(injector);

    }
}
