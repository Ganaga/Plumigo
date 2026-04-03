import './style.css';
import { registerRoute, initRouter } from './router';
import { renderDashboard } from './modules/dashboard/dashboard';
import { renderWriting } from './modules/writing/writing';
import { renderProfile } from './modules/profile/profile';
import { updateFavicon } from './shared/favicon';

registerRoute('', renderDashboard);
registerRoute('writing', renderWriting);
registerRoute('profile', renderProfile);

updateFavicon();
initRouter();
