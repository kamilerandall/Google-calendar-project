"use strict";

import { getFullWeek, displayDate } from "./weekInfo.js";
import { createDynamicWeekCalPart, createStaticWeekCalPart } from "./constructors.js";
import { renderSmallCalendar } from "./smallCal.js";
import { openMakeEventModal } from "./events2.js";
import { currFullDate, getNewFullDate } from "./state.js";

renderSmallCalendar();

let currWeekInfo = getFullWeek();
displayDate(currWeekInfo);
createStaticWeekCalPart();
createDynamicWeekCalPart(currWeekInfo);

document.querySelector(".icons").addEventListener("click", (e) => {
	if (e.target.className.includes("prev")) {
		getNewFullDate(-7);
	} else if (e.target.className.includes("next")) {
		getNewFullDate(7);
	} else {
		currFullDate.setTime(Date.now());
	}
	currWeekInfo = getFullWeek();

	displayDate(currWeekInfo);
	createDynamicWeekCalPart(currWeekInfo);

	const timeGrid = document.querySelector(".by-the-hour");
	timeGrid.addEventListener("click", (e) => {
		openMakeEventModal(e.target);
	});
});

const timeGrid = document.querySelector(".by-the-hour");
timeGrid.addEventListener("click", (e) => {
	openMakeEventModal(e.target);
});

