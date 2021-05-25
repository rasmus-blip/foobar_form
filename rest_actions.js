const headers = {
  headersHeroku: {
    "Content-Type": "application/json",
  },
  headersRestDB: {
    "Content-Type": "application/json",
    "x-apikey": "60740776f592f7113340ef9b",
    "cache-control": "no-cache",
  },
};

export async function getJSON(url, header) {
  const respons = await fetch(url, {
    method: "get",
    headers: headers[header],
  });
  const jsonData = await respons.json();
  return jsonData;
}

export async function post(data, url, header) {
  const postData = JSON.stringify(data);

  const response = await fetch(url, {
    method: "post",
    headers: headers[header],
    body: postData,
  });
  const result = await response.json();

  return result;
}
