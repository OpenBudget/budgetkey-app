import { MuniDescriptor } from '../../../model';
import questions from '../questions';

export default new MuniDescriptor({
  pathPrefix: 'org/municipality',
  titleTemplate: require('../title-template.html'),
  preTitleTemplate: require('../pretitle-template.html'),
  amountTemplate: require('../amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  questions,
  textTemplate: require('./text-template.html'),
});
