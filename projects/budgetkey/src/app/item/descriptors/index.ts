import descriptorReportNGOActivity from './reports/ngo-activity-report';
import descriptorReportNGODistrict from './reports/ngo-district-report';

import { DescriptorBase } from '../model/descriptor';

const DESCRIPTORS: DescriptorBase[] = [
  descriptorReportNGOActivity,
  descriptorReportNGODistrict,
];

export default DESCRIPTORS;
