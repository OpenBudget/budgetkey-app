import { OrgDescriptor } from '../../../model';
import questions from '../questions';

export default new OrgDescriptor({
  pathPrefix: 'org/association/',
  amountTemplate: require('./amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  questions,
  textTemplate: require('./text-template.html'),
  visualizationTemplates: {
    org_status: require('./org-status.html'),
    org_credentials: require('./org-credentials.html'),
  },
  tips: [
    require('./guidestar.html'),
    require('./registrar.html'),
  ]
});
