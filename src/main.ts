import './style.css';
import { registerRoute, initRouter } from './router';
import { renderDashboard } from './modules/dashboard/dashboard';
import { renderWriting } from './modules/writing/writing';
import { renderProfile } from './modules/profile/profile';
import { renderDictation } from './modules/dictation/dictation';
import { renderHangman } from './modules/hangman/hangman';
import { renderQuiz } from './modules/quiz/quiz';
import { updateFavicon } from './shared/favicon';

registerRoute('', renderDashboard);
registerRoute('writing', renderWriting);
registerRoute('dictation', renderDictation);
registerRoute('hangman', renderHangman);
registerRoute('quiz', renderQuiz);
registerRoute('profile', renderProfile);

updateFavicon();
initRouter();
