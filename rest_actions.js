const headersHeroku = {
  "Content-Type": "application/json",
  // "x-apikey": "4e63c57a-f16b-4236-a140-d8adade5adc1",
  // "cache-control": "no-cache",
};

const headersRestDB = {
  "Content-Type": "application/json",
  "x-apikey": "01ed00f500311dd23ecf06935dd8c1e1b3836",
  "cache-control": "no-cache",
};

export async function getJSON(url) {
  const respons = await fetch(url, {
    method: "get",
    headers: headers,
  });
  const jsonData = await respons.json();
  return jsonData;
}

// export function post(data, url) {
//   const postData = JSON.stringify(data);
//   fetch(url, {
//     method: "post",
//     headers: headers,
//     body: postData,
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     });
// }

export async function post(data, url) {
  const postData = JSON.stringify(data);

  const response = await fetch(url, {
    method: "post",
    headers: headers,
    body: postData,
  });
  const result = await response.json();

  return result;
}
