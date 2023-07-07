onmessage=async(e)=>{
    let url=e.data.url
   //let respond= await fetch(url)
  // let img = await  respond.blob();
  // setTimeout(()=> postMessage(img),2000)
  const xhr= new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType='blob';
  xhr.send();
  xhr.onload=()=>{setTimeout(()=>postMessage(xhr.response),1000)}
  xhr.onprogress=(e)=>{setTimeout(()=>postMessage([e.loaded, e.total]),0)}
}