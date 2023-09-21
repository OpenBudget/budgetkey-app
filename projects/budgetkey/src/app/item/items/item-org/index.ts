import { SimpleDescriptor } from '../../model';
import questions from './questions';

export default new SimpleDescriptor({
  pathPrefix: 'org/',
  titleTemplate: require('./title-template.html'),
  preTitleTemplate: require('./pretitle-template.html'),
  amountTemplate: require('./amount-template.html'),
  subtitleTemplate: require('./subtitle-template.html'),
  textTemplate: require('./text-template.html'),
  questions
});
