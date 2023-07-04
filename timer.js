export default class Timer {
  constructor() {
    this.startTime=undefined;
    this.interval=undefined;
    this.isAborted=false
  }
  start(time) {
    this.isAborted=false;
    return new Promise((resolve) => {
      this.startTime = Date.now();
       this.interval = setInterval(() => {
        if ((Date.now() - this.startTime) / 1000 >= time || this.isAborted) {
          clearInterval(this.interval);
          return resolve();
        }
      }, 200);
    });
  }
  getCurrentSecond(){
    return((Date.now() - this.startTime) / 1000).toFixed(3)
  }
  abort(){
    clearInterval(this.interval);
    this.isAborted=true;
  }
}
