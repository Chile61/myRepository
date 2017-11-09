import { TaskFormPage } from '../../pages/enterprise/task/task-form/task-form';
import { TaskItemPage } from '../../pages/enterprise/task/task-item/task-item';
import { NgModule} from '@angular/core';
import { ShareModule } from './share.module';

import { EnterprisePage } from "../../pages/enterprise/enterprise-home/enterprise-home";
import { ClassDetailPage } from '../../pages/enterprise/class/class-detail/class-detail';
import { ClassStatisticsPage } from '../../pages/enterprise/class/class-statistics/class-statistics';
import { ClassListPage } from '../../pages/enterprise/class/class-list/class-list';
import { TaskPage } from '../../pages/enterprise/task/task';
import { IonicApp } from 'ionic-angular';
import { ClassIntroductionPage } from '../../pages/enterprise/class/class-introduction/class-introduction';
import { ClassQuestionPage } from '../../pages/enterprise/class/class-question/class-question';
import { ClassNoticePage } from '../../pages/enterprise/class/class-notice/class-notice';
import { ClassBarcodePage } from '../../pages/enterprise/class/class-barcode/class-barcode';
import { AttenHistoryPage } from '../../pages/enterprise/class/class-attenhistory/class-attenhistory';
import { InformationListPage } from '../../pages/enterprise/information/information-list/information-list';
import { AnnouncementPage } from '../../pages/enterprise/information/information-announcement/information-announcement';
import { InformationNewsPage } from '../../pages/enterprise/information/information-news/information-news';
import { InformationHtmlPage } from '../../pages/enterprise/information/information-html/information-html';
import { CaptureResultPage } from '../../pages/enterprise/class/capture-result/capture-result';
import { ClassSignUserListPage } from '../../pages/enterprise/class/class-signUserList/class-signUserList';
import { ClassStudentsPage } from '../../pages/enterprise/class/class-students/class-students';
import { TaskFeedbackPage } from '../../pages/enterprise/task/task-feedback/task-feedback';
import { TaskFormElePage } from '../../pages/enterprise/task/task-form-ele/task-form-ele';
import { ClassQuestionDetailPage } from '../../pages/enterprise/class/question-detail/question-detail';
import { ClassPostQuestionPage } from '../../pages/enterprise/class/question-post/question-post';

@NgModule({
  bootstrap: [IonicApp],
  imports: [
    ShareModule
  ],
  declarations: [
    EnterprisePage,
    ClassDetailPage,
    ClassStatisticsPage,
    ClassListPage,
    InformationListPage,
    ClassIntroductionPage,
    ClassQuestionPage,
    ClassNoticePage,
    ClassBarcodePage,
    AttenHistoryPage,
    AnnouncementPage,
    InformationNewsPage,
    InformationHtmlPage,
    CaptureResultPage,
    ClassSignUserListPage,
    ClassStudentsPage,
    ClassQuestionDetailPage,
    ClassPostQuestionPage,
    
    TaskPage,
    TaskItemPage,
    TaskFeedbackPage,
    TaskFormPage,
    TaskFormElePage
  ],
  entryComponents: [
    EnterprisePage,
    ClassDetailPage,
    ClassStatisticsPage,
    ClassListPage,
    InformationListPage,
    ClassIntroductionPage,
    ClassQuestionPage,
    ClassNoticePage,
    ClassBarcodePage,
    AttenHistoryPage,
    AnnouncementPage,
    InformationNewsPage,
    InformationHtmlPage,
    CaptureResultPage,
    ClassSignUserListPage,
    ClassStudentsPage,
    ClassQuestionDetailPage,
    ClassPostQuestionPage,

    TaskPage,
    TaskItemPage,
    TaskFeedbackPage,
    TaskFormPage,
    TaskFormElePage

  ],
  exports: [
    EnterprisePage,
    ClassDetailPage,
    ClassStatisticsPage,
    ClassListPage,
    InformationListPage,
    ClassIntroductionPage,
    ClassNoticePage,
    ClassQuestionPage,
    ClassBarcodePage,
    AttenHistoryPage,
    AnnouncementPage,
    InformationNewsPage,
    InformationHtmlPage,
    CaptureResultPage,
    ClassSignUserListPage,
    ClassStudentsPage,
    ClassQuestionDetailPage,
    ClassPostQuestionPage,

    TaskPage,
    TaskItemPage,
    TaskFeedbackPage,
    TaskFormPage,
    TaskFormElePage
  ],
  providers: [
  ]
})
export class EnterpriseModule {}
