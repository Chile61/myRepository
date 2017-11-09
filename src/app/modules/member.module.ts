import { HelpSearchPage } from '../../pages/user-center/more/help-search/help-search';
import { HelpDetailsPage } from '../../pages/user-center/more/help-details/help-details';
import { HelpPage } from '../../pages/user-center/more/help/help';
import { AboutUsPage } from '../../pages/user-center/more/about-us/about-us';
import { FuncIntroductionPage } from '../../pages/user-center/more/func-introduction/func-introduction';
import { NgModule } from '@angular/core';
import { IonicApp } from 'ionic-angular';
import { MemberPage } from '../../pages/user-center/member/member';
import { MemberInfoPage } from '../../pages/user-center/member-info/member-info';
import { MemberStatisticsPage } from '../../pages/user-center/member-statistics/member-statistics';
import { MemberHistoryPage } from '../../pages/user-center/member-history/member-history';
import { ShareModule } from './share.module';
import { MemberInfoModifyPage } from '../../pages/user-center/member-info-modify/member-info-modify';
import { MemberRankPage } from '../../pages/user-center/member-rank/member-rank';
import { MemberCommentsPage } from '../../pages/user-center/member-comments/member-comments';
import { MemberCollectionPage } from '../../pages/user-center/member-collection/member-collection';
import { MemberCollectionSearchPage } from '../../pages/user-center/member-collection-search/member-collection-search';
import { MemberIntegralPage } from '../../pages/user-center/member-integral/member-integral';
import { MoreHomePage } from '../../pages/user-center/more/more-home/more-home';
import { PhoneModifyPage } from '../../pages/user-center/more/phone-modify/phone-modify';
import { OfflineDownloadPage} from "../../pages/user-center/offline-download/offline-download";
import { MemberGroupPage } from '../../pages/user-center/member-group/member-group';
import { PasswordModifyPage } from '../../pages/user-center/more/password-modify/password-modify';

@NgModule({
  bootstrap: [IonicApp],
  imports: [
    ShareModule
  ],
  declarations: [
    MemberPage,
    MemberInfoPage,
    MemberStatisticsPage,
    MemberHistoryPage,
    MemberInfoModifyPage,
    MemberRankPage,
    MemberCommentsPage,
    MemberCollectionPage,
    MemberCollectionSearchPage,
    MemberIntegralPage,
    MoreHomePage,
    PhoneModifyPage,
    OfflineDownloadPage,
    MemberGroupPage,
    PhoneModifyPage,
    PasswordModifyPage,
    FuncIntroductionPage,
    AboutUsPage,
    HelpPage,
    HelpDetailsPage,
    HelpSearchPage
  ],
  entryComponents: [
    MemberPage,
    MemberInfoPage,
    MemberStatisticsPage,
    MemberHistoryPage,
    MemberInfoModifyPage,
    MemberRankPage,
    MemberCommentsPage,
    MemberCollectionPage,
    MemberCollectionSearchPage,
    MemberIntegralPage,
    MoreHomePage,
    PhoneModifyPage,
    OfflineDownloadPage,
    PhoneModifyPage,
    MemberGroupPage,
    PasswordModifyPage,
    FuncIntroductionPage,
    AboutUsPage,
    HelpPage,
    HelpDetailsPage,
    HelpSearchPage
  ],
  exports: [
    MemberPage,
    MemberInfoPage,
    MemberStatisticsPage,
    MemberHistoryPage,
    MemberInfoModifyPage,
    MemberRankPage,
    MemberCommentsPage,
    MemberCollectionPage,
    MemberCollectionSearchPage,
    MemberIntegralPage,
    MoreHomePage,
    PhoneModifyPage,
    OfflineDownloadPage,
    PhoneModifyPage,
    MemberGroupPage,
    PasswordModifyPage,
    FuncIntroductionPage,
    AboutUsPage,
    HelpPage,
    HelpDetailsPage,
    HelpSearchPage
  ],
  providers: [

  ]
})
export class MemberModule {}
