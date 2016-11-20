/* Creates a service to keep Android and iOS devices from going into sleep mode */
export default class WakeLockService {

  private noSleep = 'data:video/webm;base64,GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACWxFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEuTbuMU6uEHFO7a1OsggI+7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEMq17GDD0JATYCMTGF2ZjU2LjQuMTAxV0GMTGF2ZjU2LjQuMTAxc6SQ20Yv/Elws73A/+KfEjM11ESJiEBkwAAAAAAAFlSuawEAAAAAAABHrgEAAAAAAAA+14EBc8WBAZyBACK1nIN1bmSGhVZfVlA4g4EBI+ODhAT3kNXgAQAAAAAAABKwgRC6gRBTwIEBVLCBEFS6gRAfQ7Z1AQAAAAAAALHngQCgAQAAAAAAAFyho4EAAIAQAgCdASoQABAAAEcIhYWIhYSIAgIADA1gAP7/q1CAdaEBAAAAAAAALaYBAAAAAAAAJO6BAaWfEAIAnQEqEAAQAABHCIWFiIWEiAICAAwNYAD+/7r/QKABAAAAAAAAQKGVgQBTALEBAAEQEAAYABhYL/QACAAAdaEBAAAAAAAAH6YBAAAAAAAAFu6BAaWRsQEAARAQABgAGFgv9AAIAAAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBgfCBAw==';

  /* Enable the WakeLockService */
  public enable: () => void;

  /* Disable the WakeLockService */
  public disable: () => void;


  constructor() {
    var userAgent = navigator.userAgent || navigator.vendor || window['opera'];
    if (userAgent.match(/i(Phone|Pad|Pod)/i)) {
      this.ios();
    } else {
      this.android();
    }
  }

  onDestroy() {
    this.disable();
  }

  private android() {
    var video = document.createElement('video');
    video.addEventListener('ended', function () {
      video.play();
    });
    this.enable = function () {
      if (video.paused) {
        video.src = this.noSleep;
        video.play();
      }
    };
    this.disable = function () {
      video.pause();
      video.src = '';
    };
  }

  private ios() {
    var timer = null;
    this.enable = function () {
      if (!timer) {
        timer = setInterval(function () {
          window.location.href = window.location.href;
          setTimeout(window.stop, 0);
        }, 30000);
      }
    }
    this.disable = function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }
}
