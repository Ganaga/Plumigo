import './style.css';
import { registerRoute, initRouter } from './router';
import { renderDashboard } from './modules/dashboard/dashboard';
import { renderTyping } from './modules/typing/typing';
import { renderWriting } from './modules/writing/writing';
import { renderProfile } from './modules/profile/profile';

registerRoute('', renderDashboard);
registerRoute('typing', renderTyping);
registerRoute('writing', renderWriting);
registerRoute('profile', renderProfile);

initRouter();
