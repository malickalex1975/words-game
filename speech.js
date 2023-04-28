export default class Speech {
  constructor(lang = "en") {
    this.lang = lang;
    this.recognition = undefined;
  }
  lookForSoundStart() {
    return new Promise((resolve, reject) => {
      const soundstartListener = () => resolve('ok, sound started');
      if (this.recognition) {
        this.recognition.addEventListener("speechstart", soundstartListener);
      }
      this.recognition.onerror = (event) => {
        console.log("error:", event.error);
        this.recognition.stop();
        return reject(event.error);
      };
    });
  }
  lookForAudioStart() {
    return new Promise((resolve, reject) => {
      const audiostartListener = () => resolve('ok, audio started');
      if (this.recognition) {
        this.recognition.addEventListener("audiostart", audiostartListener);
      }
      this.recognition.onerror = (event) => {
        console.log("error:", event.error);
        this.recognition.stop();
        return reject(event.error);
      };
    });
  }
  speechRecognition() {
   
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
          }, 10000);

          let listener = (event) => {
            isStarted = false;
            clearInterval(interval);
            const results = event.results;
            const phrase = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            Array.from(results).forEach((element) => {
              Array.from(element).forEach((el) => console.log(el));
            });
            console.dir(`Results: ${event.results}`);
            console.log(`Result received: ${phrase}`);
             this.recognition.stop();

            return resolve({ phrase, confidence, results });
          };

          const nomatchListener = () => {
            return reject("speech not recognized! Try again!");
          };
          const soundstartListener = () => {
            console.log("soundstart");
          };
          const soundendListener = () => {
            console.log("soundend");
          };
          const audiostartListener = () => {
            console.log("audiostart");
          };
          const audioendListener = () => {
            console.log("audioend");
          };
          const speechstartListener = () => {
            console.log("speechstart");
          };
          const speechendListener = () => {
            console.log("speechdend");
          };
          this.recognition.addEventListener("result", listener);
          this.recognition.addEventListener("nomatch", nomatchListener, {
            once: true,
          });
          this.recognition.addEventListener("soundend", soundendListener);
          this.recognition.addEventListener("soundstart", soundstartListener);
          this.recognition.addEventListener("audioend", audioendListener);
          this.recognition.addEventListener("audiostart", audiostartListener);
          this.recognition.addEventListener("speechend", speechendListener);
          this.recognition.addEventListener("speechstart", speechstartListener);

          this.recognition.onerror = (event) => {
            console.log("error:", event.error);
            this.recognition.stop();
            return reject(event.error);
          };
        } else {
          return reject("SpeechRecognition doesn't support");
        }
      });
    
  }
  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      console.log("Recognition stopped!");
    }
  }
}
