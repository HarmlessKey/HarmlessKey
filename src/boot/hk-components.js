import HkTable from '../components/hk-components/hk-table';
import HkCard from '../components/hk-components/hk-card';
import HkCardDeck from '../components/hk-components/hk-card-deck';
import HkRoll from '../components/hk-components/hk-roll';
import HkAnimatedInteger from '../components/hk-components/hk-animated-integer';
import HkDiceText from '../components/hk-components/hk-dice-text';
import HkPopover from '../components/hk-components/hk-popover';
import HkLoader from '../components/hk-components/hk-loader';
import HkDmgTypeSelect from '../components/hk-components/hk-dmg-type-select';
import HkTip from '../components/hk-components/hk-tip';
import HkTimer from '../components/hk-components/hk-timer';
import HkShare from '../components/hk-components/hk-share-button';
import HkImageUploader from '../components/hk-components/hk-image-uploader';
import HkBackgroundSelect from '../components/hk-components/hk-background-select';

export default async ({ Vue }) => {
	Vue.component('hk-table', HkTable);
  Vue.component('hk-card', HkCard);
  Vue.component('hk-card-deck', HkCardDeck);
  Vue.component('hk-animated-integer', HkAnimatedInteger);
  Vue.component('hk-roll', HkRoll);
  Vue.component('hk-loader', HkLoader);
  Vue.component('hk-dice-text', HkDiceText);
  Vue.component('hk-popover', HkPopover);
  Vue.component('hk-dmg-type-select', HkDmgTypeSelect);
  Vue.component('hk-tip', HkTip);
  Vue.component('hk-timer', HkTimer);
  Vue.component('hk-share', HkShare);
  Vue.component('hk-image-uploader', HkImageUploader);
  Vue.component('hk-background-select', HkBackgroundSelect);
};