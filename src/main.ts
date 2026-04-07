import './style.css';
import './shared/keyboard.css';
import { registerRoute, initRouter } from './router';
import { renderDashboard } from './modules/dashboard/dashboard';
import { renderWriting } from './modules/writing/writing';
import { renderProfile } from './modules/profile/profile';
import { renderDictation } from './modules/dictation/dictation';
import { updateFavicon } from './shared/favicon';

registerRoute('', renderDashboard);
registerRoute('writing', renderWriting);
registerRoute('dictation', renderDictation);
registerRoute('profile', renderProfile);

updateFavicon();
initRouter();
