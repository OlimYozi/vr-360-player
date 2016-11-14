import CorePlayer from './player/CorePlayer';

import './styles/index.scss';

const player = new CorePlayer(
  <HTMLElement>document.getElementById('vr-360-player'),
  require('./assets/stage.json')
);

/* EVENT LISTENERS */

window.addEventListener('focus', player.onResume.bind(player));
window.addEventListener('resize', player.onResize.bind(player));
window.addEventListener('blur', player.onPause.bind(player));
window.addEventListener('unload', player.onDestroy.bind(player));