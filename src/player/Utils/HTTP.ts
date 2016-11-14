//------------------------------------------------------------------------------------
// HTTP UTILITIES
//------------------------------------------------------------------------------------

export default class HTTP {

  static request(method: string, path: string, data?: any, success?: (res: any) => void, error?: (err: any) => void) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, path, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    if (typeof data !== 'undefined')
      xhr.send(JSON.stringify(data));

    if (typeof success === 'function') {
      xhr.onload = function (event) {
        try {
          success(JSON.parse(xhr.responseText));
        } catch (e) {
          success(xhr.responseText);
        }
        return true;
      };
    }

    if (typeof error === 'function') {
      xhr.onload = function (event) {
        try {
          error(JSON.parse(xhr.responseText));
        } catch (e) {
          error(xhr.responseText);
        }
        return true;
      };
    }
  };

  static post(path: string, data?: any, success?: (res: any) => void, error?: (err: any) => void) { this.request('POST', path, data, success, error) };

  static get(path: string, data?: any, success?: (res: any) => void, error?: (err: any) => void) { this.request('GET', path, data, success, error) };

  static put(path: string, data?: any, success?: (res: any) => void, error?: (err: any) => void) { this.request('PUT', path, data, success, error) };

  static delete(path: string, data?: any, success?: (res: any) => void, error?: (err: any) => void) { this.request('DELETE', path, data, success, error) };

  static jsonp(path: string, options?: any, callback?: string) {
    options = Object.assign({
      cache: false,
    }, options);

    var hasQuery = path.indexOf('?') > -1;

    var jsonp = document.createElement('script');
    jsonp.src = path +
      (!hasQuery ? '?' : '') +
      (!options.cache ? '&uid=' + Date.now() : '') +
      (typeof callback === 'string' ? '&callback=' + callback : '');
    document.body.appendChild(jsonp);

    jsonp.onload = function () {
      this.remove();
    };
  };
};
