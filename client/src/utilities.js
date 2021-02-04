
function formatParams(params) {
  return Object.keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
}

function convertToJSON(res) {
  if (!res.ok) {
    throw `API request failed with response status ${res.status} and text: ${res.statusText}`;
  }

  return res
    .clone()
    .json() 
    .catch((error) => {
      return res.text().then((text) => {
        throw `API request's result could not be converted to a JSON object: \n${text}`;
      });
    });
}
export function convertPicture(SIZE_, picture){
  if (picture.split('/')[picture.split('/').length - 2] === 's96-c'){
    let arr = picture.split('/');
    arr[arr.length - 2] = arr[arr.length - 2][0]+SIZE_+arr[arr.length - 2].substring(3);
    return arr.join('/');
  }else if (picture.split('=')[picture.split('=').length - 1] === 's96-c'){
    let arr = picture.split('=');
    arr[arr.length-1] = arr[arr.length - 1][0]+SIZE_+arr[arr.length - 1].substring(3);
    return arr.join('=');
  }else{
    return picture;
  }
}

export function convertDate(stamp){
  const d = new Date(stamp);
  const AMPM = d.toLocaleTimeString().split(' ')[1]
  const minutes = d.toLocaleTimeString().split(' ')[0].split(":")[0] + ':' + d.toLocaleTimeString().split(' ')[0].split(":")[1]
  const date = d.toLocaleDateString().split("/");
  return date[0]+"/"+date[1]+"/"+date[2] + ' ' + minutes+AMPM;
}

export function get(endpoint, params = {}) {
  const fullPath = endpoint + "?" + formatParams(params);
  return fetch(fullPath)
    .then(convertToJSON)
    .catch((error) => {
      throw `GET request to ${fullPath} failed with error:\n${error}`;
    });
}


export function post(endpoint, params = {}) {
  return fetch(endpoint, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(params),
  })
    .then(convertToJSON)
    .catch((error) => {
      throw `POST request to ${endpoint} failed with error:\n${error}`;
    });
}
