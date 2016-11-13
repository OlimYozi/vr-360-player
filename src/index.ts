import VR360Player from './player/VR360Player';

import './styles/index.scss';

const player = new VR360Player(<HTMLElement>document.getElementById('vr-360-player'));

/* EVENT LISTENERS */

window.addEventListener('focus', player.onResume.bind(player));
window.addEventListener('resize', player.onResize.bind(player));
window.addEventListener('blur', player.onPause.bind(player));
window.addEventListener('unload', player.onDestroy.bind(player));