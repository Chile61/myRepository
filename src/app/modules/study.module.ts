import {NgModule} from "@angular/core";
import {ShareModule} from "./share.module";
import {IonicApp} from "ionic-angular";
import {StudyHomePage} from "../../pages/study/study-home/study-home";
import {CourseSearchPage} from "../../pages/study/course-search/course-search";
import {CourseDetailPage} from "../../pages/study/course-detail/course-detail";
import {CourseSearchResultPage} from "../../pages/study/course-search-result/course-search-result";
import {ClassifyLabelCoursePage} from "../../pages/study/classify-label-course/classify-label-course";
import {MoreCoursePage} from "../../pages/study/more-course/more-course";
import {ColumnCoursePage} from "../../pages/study/column-course/column-course";
import {ThemeCoursePage} from "../../pages/study/theme-course/theme-course";
import {ThemeColumnDetail} from "../../pages/study/theme-detail/theme-detail";
import {ThemeColumnSearchPage} from "../../pages/study/theme-column-search/theme-column-search";
import {CourseRankPage} from "../../pages/study/course-rank/course-rank";
import {PublicCoursePage} from "../../pages/study/public-course/public-course";
import {PublicLabelPage} from "../../pages/study/public-course-label/public-course-label";
import {ShowImagePage} from "../../pages/study/show-image/show-image";
import {ShowPPTPage} from "../../pages/study/show-ppt/show-ppt";
import {MoreRecommendPage} from "../../pages/study/more-recommend/more-recommend";
import {ShowHtmlPage} from "../../pages/study/show-html/show-html";
import {ShowH5Page} from "../../pages/study/show-h5/show-h5";
import {CategoryUtils} from "../../pages/study/CategoryUtils";
import {CourseCollectionPage} from "../../pages/study/course-collection/course-collection";
import {FamousTeacherPage} from "../../pages/study/famous-teacher/famous-teacher";
import {TeacherDetail} from "../../pages/study/teacher-detail/teacher-detail";
import {TeacherSearchPage} from "../../pages/study/teacher-search/teacher-search";
import {CourseCommentRankPage} from "../../pages/study/course-rank/comment-course-rank/comment-course-rank";
import {CourseFavoriteRankPage} from "../../pages/study/course-rank/favorite-course-rank/favorite-course-rank";
import {CourseAppraiseRankPage} from "../../pages/study/course-rank/appraise-course-rank/appraise-course-rank";

@NgModule({
    bootstrap: [IonicApp],
    imports: [
        ShareModule
    ],
    declarations: [
        StudyHomePage,
        CourseSearchPage,
        CourseDetailPage,
        CourseSearchResultPage,
        ClassifyLabelCoursePage,
        MoreRecommendPage,
        MoreCoursePage,
        ColumnCoursePage,
        ThemeCoursePage,
        ThemeColumnDetail,
        ThemeColumnSearchPage,
        CourseRankPage,
        PublicCoursePage,
        PublicLabelPage,
        ShowImagePage,
        ShowPPTPage,
        ShowHtmlPage,
        ShowH5Page,
        CourseCollectionPage,
        FamousTeacherPage,
        TeacherDetail,
        TeacherSearchPage,
        CourseCommentRankPage,
        CourseFavoriteRankPage,
        CourseAppraiseRankPage
    ],
    entryComponents: [
        StudyHomePage,
        CourseSearchPage,
        CourseDetailPage,
        CourseSearchResultPage,
        ClassifyLabelCoursePage,
        MoreRecommendPage,
        MoreCoursePage,
        ColumnCoursePage,
        ThemeCoursePage,
        ThemeColumnDetail,
        ThemeColumnSearchPage,
        CourseRankPage,
        PublicCoursePage,
        PublicLabelPage,
        ShowImagePage,
        ShowPPTPage,
        ShowHtmlPage,
        ShowH5Page,
        CourseCollectionPage,
        FamousTeacherPage,
        TeacherDetail,
        TeacherSearchPage,
        CourseCommentRankPage,
        CourseFavoriteRankPage,
        CourseAppraiseRankPage
    ],
    exports: [
        StudyHomePage,
        CourseSearchPage,
        CourseDetailPage,
        CourseSearchResultPage,
        ClassifyLabelCoursePage,
        MoreRecommendPage,
        MoreCoursePage,
        ColumnCoursePage,
        ThemeCoursePage,
        ThemeColumnDetail,
        ThemeColumnSearchPage,
        CourseRankPage,
        PublicCoursePage,
        PublicLabelPage,
        ShowImagePage,
        ShowPPTPage,
        ShowHtmlPage,
        ShowH5Page,
        CourseCollectionPage,
        FamousTeacherPage,
        TeacherDetail,
        TeacherSearchPage,
        CourseCommentRankPage,
        CourseFavoriteRankPage,
        CourseAppraiseRankPage
    ],
    providers: [CategoryUtils]
})
export class StudyModule {
}
