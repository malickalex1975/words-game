export default class Speech {
  constructor(lang = "en") {
    this.lang = lang;
    this.recognition = undefined;
    this.isStarted = false;
    this.listener = undefined;
    this.soundendListener = undefined;
    this.soundstartListener = undefined;
    this.audioendListener = undefined;
    this.audiostartListener = undefined;
    this.speechendListener = undefined;
    this.speechstartListener = undefined;
    this.nomatchListener=undefined
    this.interval=undefined
  }
  lookForSoundStart() {
    return new Promise((resolve, reject) => {
      this.soundstartListener = () => resolve("ok, sound started");
      if (this.recognition) {
        this.recognition.addEventListener("speechstart", this.soundstartListener);
      }
    });
  }
  lookForAudioStart() {
    return new Promise((resolve, reject) => {
      this.audiostartListener = () => resolve("ok, audio started");
      if (this.recognition) {
        this.recognition.addEventListener("audiostart", this.audiostartListener);
      }
    });
  }
  speechRecognition() {
  
    return new Promise((resolve, reject) => {
      if ("webkitSpeechRecognition" in window) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = this.lang;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 10;
        this.recognition.start();
        console.log("Ready to receive a command.");
        this.isStarted = true;
        this.interval = setInterval(() => {
          if (this.isStarted) {
            clearInterval(this.interval);
            this.stopRecognition();
            return reject("It took too long time!Try again!");
          }
        }, 10000);

        this.listener = (event) => {
          this.isStarted = false;
          clearInterval(this.interval);
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

        this.nomatchListener = () => {
          return reject("speech not recognized! Try again!");
        };
       
        this.soundendListener = () => {
          console.log("soundend");
        };
        
        this.audioendListener = () => {
          console.log("audioend");
        };
        this.speechstartListener = () => {
          console.log("speechstart");
        };
        this.speechendListener = () => {
          console.log("speechdend");
        };
        this.recognition.addEventListener("result", this.listener);
        this.recognition.addEventListener("nomatch", this.nomatchListener, {
          once: true,
        });
        this.recognition.addEventListener("soundend", this.soundendListener);
        this.recognition.addEventListener(
          "soundstart",
          this.soundstartListener
        );
        this.recognition.addEventListener("audioend", this.audioendListener);
        this.recognition.addEventListener(
          "audiostart",
          this.audiostartListener
        );
        this.recognition.addEventListener("speechend", this.speechendListener);
        this.recognition.addEventListener(
          "speechstart",
          this.speechstartListener
        );

        this.recognition.onerror = (event) => {
          this.isStarted = false;
          clearInterval(this.interval)
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
      this.isStarted = false;
      clearInterval(this.interval)
      this.recognition.stop();
      console.log("Recognition stopped!");
      this.removeListeners();
    }
  }
  abortRecognition() {
    if (this.recognition) {
      this.isStarted = false;
      clearInterval(this.interval)
      this.recognition.abort();
      console.log("Recognition aborted!");
      this.removeListeners();
    }
  }
  removeListeners() {
    this.recognition.removeEventListener("result", this.listener);
    this.recognition.removeEventListener("nomatch", this.nomatchListener, {
      once: true,
    });
    this.recognition.removeEventListener("soundend", this.soundendListener);
    this.recognition.removeEventListener("soundstart", this.soundstartListener);
    this.recognition.removeEventListener("audioend", this.audioendListener);
    this.recognition.removeEventListener("audiostart", this.audiostartListener);
    this.recognition.removeEventListener("speechend", this.speechendListener);
    this.recognition.removeEventListener(
      "speechstart",
      this.speechstartListener
    );
  }
}
