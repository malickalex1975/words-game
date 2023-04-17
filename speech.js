export default class Speech{
    constructor(lang){
        this.lang=lang
    }

    speechRecognition() {
        let timeStart, currentTime
        return new Promise((resolve, reject) => {
          if ("webkitSpeechRecognition" in window) {
          const recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.lang = this.lang;
            recognition.interimResults = false;
            recognition.maxAlternatives = 10;
            recognition.start();
            timeStart= Date.now()
            console.log("Ready to receive a command.");
    
            let listener = (event) => {
              const phrase = event.results[0][0].transcript;
              const confidence = event.results[0][0].confidence;
             Array.from( event.results).forEach(element => {
                Array.from(element).forEach((el)=>console.log(el))
              });
              console.dir(`Results: ${event.results}`);
              console.log(`Result received: ${phrase}`);
              recognition.stop();
              recognition.removeEventListener("result", listener);
              return resolve({phrase,confidence});
            };
    
            recognition.addEventListener("result", listener);
            recognition.addEventListener("nomatch", ()=> resolve({phrase:"say again",confidence:0}));
    
            recognition.onerror = (event) => {
              console.log("error:", event.error);
              recognition.stop();
              
                return reject(event.error);
              }
            
          } else {
            return reject("SpeechRecognition doesn't support");
          }
        });
      }
}