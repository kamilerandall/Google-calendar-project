"use strict";

import { createHours, createWeekdays, createNumWeekdays, createGrid } from "./constructors.js";
import { renderSmallCalendar } from "./smallCal.js";
import { openCreateEventModal } from "./events.js";

const currFullDate = new Date();
getFullWeek(currFullDate);

renderSmallCalendar();
createHours();
createWeekdays();

const mainIcons = document.querySelector(".icons");
mainIcons.addEventListener("click", (e) => {
	const newCurrDate = currFullDate.getDate();
	if (e.target.className.includes("prev")) {
		currFullDate.setDate(newCurrDate - 7);
	} else if (e.target.className.includes("next")) {
		currFullDate.setDate(newCurrDate + 7);
	} else {
		currFullDate.setTime(Date.now());
	}
	getFullWeek(currFullDate);
});

function getFullWeek(currFullDate) {
	const currDateOfTheMonth = currFullDate.getDate();
	const currDayOfTheWeek = currFullDate.getDay();

	const firstDateOfCurrWeekFull = new Date(
		currFullDate.getFullYear(),
		currFullDate.getMonth(),
		currDateOfTheMonth - currDayOfTheWeek
	);
	const lastDateOfCurrWeekFull = new Date(
		currFullDate.getFullYear(),
		currFullDate.getMonth(),
		currFullDate.getDate() + (6 - currDayOfTheWeek)
	);

	const currWeekInfo = getWeekInfo(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull, currFullDate);

	displayDate(currFullDate, currWeekInfo);
	createNumWeekdays(currWeekInfo.currWeek, currFullDate);
	createGrid(currWeekInfo.currWeek, 24);
}

function getWeekInfo(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull, currFullDate) {
	return firstDateOfCurrWeekFull.getDate() < lastDateOfCurrWeekFull.getDate()
		? getWeekInfoInOneMonth(firstDateOfCurrWeekFull.getDate(), lastDateOfCurrWeekFull.getDate())
		: firstDateOfCurrWeekFull.getDate() > currFullDate.getDate()
		? getWeekInfoBetweenPrevAndCurrMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull, currFullDate)
		: getWeekInfoBetweenCurrAndNextMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull);
}

function getWeekInfoInOneMonth(firstDateOfCurrWeek, lastDateOfCurrWeek) {
	const weekInfo = {
		currWeek: [],
	};
	for (let i = firstDateOfCurrWeek; i <= lastDateOfCurrWeek; i++) {
		weekInfo.currWeek.push(i);
	}
	return weekInfo;
}

function getWeekInfoBetweenPrevAndCurrMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull) {
	const weekInfo = {
		currWeek: [],
	};

	const lastDateOfPrevMonth = new Date(
		firstDateOfCurrWeekFull.getFullYear(),
		firstDateOfCurrWeekFull.getMonth() + 1,
		0
	).getDate();

	for (let i = firstDateOfCurrWeekFull.getDate(); i <= lastDateOfPrevMonth; i++) {
		weekInfo.currWeek.push(i);
	}
	for (let i = 1; i <= lastDateOfCurrWeekFull.getDate(); i++) {
		weekInfo.currWeek.push(i);
	}

	return addMonthAndYearOfCurrWeek(weekInfo, firstDateOfCurrWeekFull, lastDateOfCurrWeekFull);
}

function getWeekInfoBetweenCurrAndNextMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull) {
	const weekInfo = {
		currWeek: [],
	};

	const lastDateOfCurrMonth = new Date(
		firstDateOfCurrWeekFull.getFullYear(),
		firstDateOfCurrWeekFull.getMonth() + 1,
		0
	).getDate();

	for (let i = firstDateOfCurrWeekFull.getDate(); i <= lastDateOfCurrMonth; i++) {
		weekInfo.currWeek.push(i);
	}
	for (let i = 1; i <= lastDateOfCurrWeekFull.getDate(); i++) {
		weekInfo.currWeek.push(i);
	}

	return addMonthAndYearOfCurrWeek(weekInfo, firstDateOfCurrWeekFull, lastDateOfCurrWeekFull);
}

function addMonthAndYearOfCurrWeek(weekInfo, firstDateOfCurrWeekFull, lastDateOfCurrWeekFull) {
	weekInfo.firstMonth = firstDateOfCurrWeekFull.getMonth();
	weekInfo.firstMonthsYear = firstDateOfCurrWeekFull.getFullYear();
	weekInfo.lastMonth = lastDateOfCurrWeekFull.getMonth();
	weekInfo.lastMonthsYear = lastDateOfCurrWeekFull.getFullYear();
	return weekInfo;
}

function displayDate(currFullDate, weekInfo) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const date = document.querySelector(".current-date");

	const isTwoYearsAndMonths =
		weekInfo?.firstMonthsYear && weekInfo.firstMonthsYear !== weekInfo.lastMonthsYear;
	const isTwoMonthsOneYear = weekInfo?.firstMonth;
	const twoMonthsAndYears = `${months[weekInfo.firstMonth]} ${weekInfo.firstMonthsYear} - ${
		months[weekInfo.lastMonth]
	} ${weekInfo.lastMonthsYear}`;
	const twoMonthsOneYear = `${months[weekInfo.firstMonth]} - ${
		months[weekInfo.lastMonth]
	} ${currFullDate.getFullYear()}`;
	const oneMonthOneYear = `${months[currFullDate.getMonth()]} ${currFullDate.getFullYear()}`;

	date.innerHTML = isTwoYearsAndMonths
		? twoMonthsAndYears
		: isTwoMonthsOneYear
		? twoMonthsOneYear
		: oneMonthOneYear;

	if (weekInfo?.firstMonthsYear && weekInfo.firstMonthsYear !== weekInfo.lastMonthsYear) {
		date.innerHTML = `${months[weekInfo.firstMonth]} ${weekInfo.firstMonthsYear} - ${
			months[weekInfo.lastMonth]
		} ${weekInfo.lastMonthsYear}`;
	} else {
		date.innerHTML = weekInfo?.firstMonth
			? `${months[weekInfo.firstMonth]} - ${months[weekInfo.lastMonth]} ${currFullDate.getFullYear()}`
			: `${months[currFullDate.getMonth()]} ${currFullDate.getFullYear()}`;
	}
}

const timeGrid = document.querySelector(".by-the-hour");
timeGrid.addEventListener("click", (e) => {
	openCreateEventModal(e.target);
});

// const timeGrid = document.querySelectorAll(".cell");
// timeGrid.forEach((cell) => {
// 	cell.addEventListener("click", (e) => {
// 		createEvent(e.target);
// 	});
// });
