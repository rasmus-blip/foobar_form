let distance = 0;
let fieldsetNumber = 1;
const allFieldsets = document.querySelectorAll("fieldset");
const noOfFieldsets = allFieldsets.length;

// function that decides the width of the slider depending on how many fieldset there is
export function initialSlideCalc() {
  const slider = document.querySelector("#fieldset_slider");
  slider.style.width = `${noOfFieldsets * 100}%`;
}

export function slideFieldset(that) {
  const slideDistance = 100 / noOfFieldsets;

  //calculate new distance
  const isNext = that.classList.contains("next");
  if (isNext === true) {
    distance += slideDistance;
    fieldsetNumber++;
  } else {
    distance -= slideDistance;
    fieldsetNumber--;
  }

  //apply new distance
  const slider = document.querySelector("#fieldset_slider");
  const newDistance = `-${distance}%`;
  slider.style.setProperty("--slide-distance", newDistance);
}
