export default class FS {
  static filename(path: string) {
    return /^.+\/([^/]+)$/.exec(path)[1];
  }

  static path(path: string) {
    return /^(.+\/)[^/]+$/.exec(path)[1];
  }
}