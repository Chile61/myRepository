/**
 * Created by zxh on 2016/12/16.
 */
//能力标签
export class ClassifyLabelVo {
    competencyId: number;
    competencyName: string;
    smallIcon: string;
    parentCompcyId: number;
    subCompetencyVoLs: ClassifyLabelVo;

    constructor() {

    }
}
