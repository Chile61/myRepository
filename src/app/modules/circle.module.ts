import {NgModule} from '@angular/core';
import {IonicApp} from 'ionic-angular';
import {ShareModule} from './share.module';
import {CircleHomePage} from '../../pages/circle/circle-home/circle-home';
import {CirclePage} from '../../pages/circle/circle-circles/circle-circles';
import {CircleDetailPage} from '../../pages/circle/circle-detail/circle-detail';
import {CircleNewTopicPage} from '../../pages/circle/circle-new-topic/circle-new-topic';
import {CircleHotTopicPage} from '../../pages/circle/circle-hot-topic/circle-hot-topic';
import {CircleTopicsPage} from '../../pages/circle/circle-topics/circle-topics';
import {AttendTopicPage} from '../../pages/circle/circle-attend-topic/circle-attend-topic';
import {CirclePostPage} from '../../pages/circle/circle-post/circle-post';
import {SelectCirclePage} from '../../pages/circle/circle-select/circle-select';
import {TopicDetailPage} from '../../pages/circle/topic-detail/topic-detail';
import {CircleVotePage} from '../../pages/circle/circle-vote/circle-vote';
import {CircleVoteDetailPage} from '../../pages/circle/circle-vote-detail/circle-vote-detail';
import {SelectCircleFriendPage} from "../../pages/circle/select-circle-friend/select-circle-friend";
import { CircleIntroductionPage } from '../../pages/circle/circle-introduction/circle-introduction';
import { PopoverPage } from '../../pages/circle/circle-popoverpage/circle-popoverpage';

@NgModule({
    bootstrap: [IonicApp],
    imports: [
        ShareModule
    ],
    declarations: [
        CircleHomePage,
        CirclePage,
        CircleDetailPage,
        CircleNewTopicPage,
        CircleHotTopicPage,
        CircleTopicsPage,
        AttendTopicPage,
        CirclePostPage,
        SelectCirclePage,
        TopicDetailPage,
        CircleIntroductionPage,
        CircleVotePage,
        CircleVotePage,
        CircleVoteDetailPage,
        SelectCircleFriendPage,
        PopoverPage
    ],
    entryComponents: [
        CircleHomePage,
        CirclePage,
        CircleDetailPage,
        CircleNewTopicPage,
        CircleHotTopicPage,
        CircleTopicsPage,
        AttendTopicPage,
        CirclePostPage,
        SelectCirclePage,
        TopicDetailPage,
        CircleIntroductionPage,
        CircleVotePage,
        CircleVotePage,
        CircleVoteDetailPage,
        SelectCircleFriendPage,
        PopoverPage
    ],
    providers: [
        CircleHomePage,
        CirclePage,
        CircleDetailPage,
        CircleNewTopicPage,
        CircleHotTopicPage,
        CircleTopicsPage,
        AttendTopicPage,
        CirclePostPage,
        SelectCirclePage,
        TopicDetailPage,
        CircleIntroductionPage,
        CircleVoteDetailPage,
        SelectCircleFriendPage,
        PopoverPage
    ]
})
export class CircleModule {
}
