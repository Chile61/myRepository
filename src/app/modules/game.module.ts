import {NgModule} from '@angular/core';
import {IonicApp} from 'ionic-angular';
import {ShareModule} from './share.module';

// 班级考试
import {ClassExamPage} from '../../pages/class-exam/class-exam/class-exam'
import {ClassExamSubjectPage} from '../../pages/class-exam/class-exam-subject/class-exam-subject'
import {ClassExamResultPage} from '../../pages/class-exam/class-exam-result/class-exam-result'
import {ClassExamAnalysisPage} from '../../pages/class-exam/class-exam-analysis/class-exam-analysis'
import {ClassPracticePage} from '../../pages/class-exam/class-practice/class-practice'
import {ClassPracticeAnalysisPage} from '../../pages/class-exam/class-practice-analysis/class-practice-analysis'
//闯关
import {GamePage} from '../../pages/game/game/game'
import {GameMorePage} from '../../pages/game/game-more/game-more'
import {GameDetailsPage} from '../../pages/game/game-details/game-details'
import {GameCoursePage} from '../../pages/game/game-course/game-course'
import {GameCommentPage} from '../../pages/game/game-comment/game-comment'
import {GameExamPage} from '../../pages/game/game-exam/game-exam'
import {GameResultPage} from '../../pages/game/game-result/game-result'
import {GameAnalysisPage} from '../../pages/game/game-analysis/game-analysis'
import {ProblemUtilPage} from '../../core/problem/problemUtil'
@NgModule({
    bootstrap: [IonicApp],
    imports: [
        ShareModule
    ],
    declarations: [
        ClassExamPage,
        ClassExamSubjectPage,
        ClassExamResultPage,
        ClassExamAnalysisPage,
        ClassPracticePage,
        ClassPracticeAnalysisPage,
        GamePage,
        GameMorePage,
        GameDetailsPage,
        GameCoursePage,
        GameCommentPage,
        GameExamPage,
        GameResultPage,
        ProblemUtilPage,
        GameAnalysisPage
    ],
    entryComponents: [
        ClassExamPage,
        ClassExamSubjectPage,
        ClassExamResultPage,
        ClassExamAnalysisPage,
        ClassPracticePage,
        ClassPracticeAnalysisPage,
        GamePage,
        GameMorePage,
        GameDetailsPage,
        GameCoursePage,
        GameCommentPage,
        GameExamPage,
        GameResultPage,
        ProblemUtilPage,
        GameAnalysisPage
    ],
    providers: []
})
export class GameModule {
}
