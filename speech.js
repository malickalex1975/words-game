export default class Speech {
  constructor(lang='en') {
    this.lang = lang;
    this.recognition = undefined;
  }

  speechRecognition() {
    try{
    let isStarted;
    let interval;
    return new Promise((resolve, reject) => {
      if ("webkitSpeechRecognition" in window) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = this.lang;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 10;
        this.recognition.start();
        console.log("Ready to receive a command.");
        isStarted = true;
        interval = setInterval(() => {
          if (isStarted) {
            clearInterval(interval);
            this.stopRecognition();
            return reject("It took too long time!Try again!");
          }
        }, 7000);

        let listener = (event) => {
          isStarted = false;
          clearInterval(interval);
          const results= event.results
          const phrase = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          Array.from(results).forEach((element) => {
            Array.from(element).forEach((el) => console.log(el));
          });
          console.dir(`Results: ${event.results}`);
          console.log(`Result received: ${phrase}`);
          this.recognition.stop();
          this.recognition.removeEventListener("result", listener);
          return resolve({ phrase, confidence, results });
        };
        
         const nomatchListener=()=>{return reject('speech not recognized! Try again!')}
        const audioendListener=()=>{console.log('audioend')}
        this.recognition.addEventListener("result", listener);
        this.recognition.addEventListener("nomatch",nomatchListener);
        this.recognition.addEventListener("audioend",audioendListener);

        this.onerror = (event) => {
          console.log("error:", event.error);
          this.recognition.stop();
          return reject(event.error);
        };
      } else {
        return reject("SpeechRecognition doesn't support");
      }
    });
  }catch(err){alert(`from speech.js:  ${err}`)}
  }
  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      console.log("Recognition stopped!");
    }
  }
}
