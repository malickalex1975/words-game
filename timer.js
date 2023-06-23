export default class Timer {
  constructor() {
    this.startTime=undefined;
    this.interval=undefined
  }
  start(time) {
    return new Promise((resolve) => {
      this.startTime = Date.now();
       this.interval = setInterval(() => {
        if ((Date.now() - this.startTime) / 1000 >= time) {
          clearInterval(this.interval);
          return resolve();
        }
      }, 200);
    });
  }
  getCurrentSecond(){
    return((Date.now() - this.startTime) / 1000).toFixed(2)
  }
  abort(){
    clearInterval(this.interval);
  }
}
