const headers = {
  "Content-Type": "application/json",
  // "x-apikey": "60740776f592f7113340ef9b",
  // "cache-control": "no-cache",
};

export async function getJSON(url) {
  const respons = await fetch(url, {
    method: "get",
    headers: headers,
  });
  const jsonData = await respons.json();
  return jsonData;
}

export function post(data, url) {
  const postData = JSON.stringify(data);
  fetch(url, {
    method: "post",
    headers: headers,
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}
