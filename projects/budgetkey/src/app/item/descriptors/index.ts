import descriptorTendersExemptions from './tenders/exemptions';
import descriptorTendersCentral from './tenders/central';
import descriptorTendersOffice from './tenders/office';
import descriptorCallsForBids from './tenders/calls_for_bids';
import descriptorSupportCriteria from './tenders/support_criteria';
import descriptorMuniTender from './tenders/municipal';
import descriptorContractSpending from './contract-spending';
import descriptorSupports from './supports';
import descriptorReportNGOActivity from './reports/ngo-activity-report';
import descriptorReportNGODistrict from './reports/ngo-district-report';
import descriptorPeople from './people';
import descriptorGovDecisions from './gov_decisions';
import descriptorSocialService from './activities/social_services';
import descriptorGovSocialServiceUnit from './gov_social_service_unit';

import { DescriptorBase } from '../model/descriptor';

const DESCRIPTORS: DescriptorBase[] = [
  descriptorTendersExemptions,
  descriptorTendersCentral,
  descriptorTendersOffice,
  descriptorCallsForBids,
  descriptorSupportCriteria,
  descriptorMuniTender,
  descriptorContractSpending,
  descriptorSupports,
  descriptorReportNGOActivity,
  descriptorReportNGODistrict,
  descriptorPeople,
  descriptorGovDecisions,
  descriptorSocialService,
  descriptorGovSocialServiceUnit,
];

export default DESCRIPTORS;
