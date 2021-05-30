const distance = {};
const fieldsetNumber = {};
const noOfFieldsets = {};

// function that decides the width of the slider depending on how many fieldset there is
export function initialSlideCalc(form) {
  const allFieldsets = document.querySelectorAll(`#${form} fieldset`);
  noOfFieldsets[form] = allFieldsets.length;
  fieldsetNumber[form] = 1;
  distance[form] = 0;
  const slider = document.querySelector(`#${form} .fieldset_slider`);
  slider.style.width = `${noOfFieldsets[form] * 100}%`;
}

export function slideFieldset(button, form) {
  const slideDistance = 100 / noOfFieldsets[form];

  //calculate new distance
  const isNext = button.classList.contains("next");
  if (isNext === true) {
    distance[form] += slideDistance;
    fieldsetNumber[form]++;
  } else {
    distance[form] -= slideDistance;
    fieldsetNumber[form]--;
  }

  //apply new distance
  const slider = document.querySelector(`#${form} .fieldset_slider`);
  const newDistance = `-${distance[form]}%`;
  slider.style.setProperty("--slide-distance", newDistance);
}
