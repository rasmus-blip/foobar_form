export function creditCardValidation(cardInfo) {
  const cardNr = remaskCardNr(cardInfo.number);
  const expDate = remaskExpDate(cardInfo.expDate);
  const cvv = remaskCvv(cardInfo.cvv);

  if (cardNr && expDate && cvv) {
    return true;
  } else {
    return false;
  }
}

function remaskCardNr(number) {
  if (number === "") {
    return false;
  }

  const result = Number(number.replaceAll(" ", ""));

  if (isNaN(result)) {
    return false;
  } else {
    return result;
  }
}

function remaskExpDate(expDate) {
  if (expDate === "") {
    return false;
  }

  const indexOfSlash = expDate.indexOf("/");
  const month = Number(expDate.substring(0, indexOfSlash));
  const year = Number(expDate.substring(indexOfSlash + 1));

  const timeStamp = new Date();
  const currentYear = timeStamp.getFullYear();
  const currentMonth = timeStamp.getMonth() + 1;

  //If the month or year on the card isNaN, or month is higher than 12
  //or year lower than the current or year higher than current + 3 - cards last for 3 years

  if (isNaN(month) || isNaN(year) || month > 12 || year + 2000 < currentYear || year + 2000 > currentYear + 3) {
    return false;
  } else if (year + 2000 === currentYear && month < currentMonth) {
    return false;
  } else if (month < 10) {
    return `0${month}/${year}`;
  } else {
    return `${month}/${year}`;
  }
}

function remaskCvv(cvv) {
  if (isNaN(cvv) || cvv === "") {
    return false;
  } else {
    return cvv;
  }
}
