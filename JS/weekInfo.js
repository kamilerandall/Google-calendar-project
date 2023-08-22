import { currFullDate } from "./state.js";

export function getFullWeek() {
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
	currWeekInfo["firstDateOfCurrWeekFull"] = firstDateOfCurrWeekFull;
	currWeekInfo["lastDateOfCurrWeekFull"] = lastDateOfCurrWeekFull;
	return currWeekInfo;
}

function getWeekInfo(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull, currFullDate) {
	return firstDateOfCurrWeekFull.getDate() < lastDateOfCurrWeekFull.getDate()
		? getWeekInfoInOneMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull)
		: firstDateOfCurrWeekFull.getDate() > currFullDate.getDate()
		? getWeekInfoBetweenPrevAndCurrMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull, currFullDate)
		: getWeekInfoBetweenCurrAndNextMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull);
}

function getWeekInfoInOneMonth(firstDateOfCurrWeekFull, lastDateOfCurrWeekFull) {
	const weekInfo = {
		currWeek: [],
	};
	for (let i = firstDateOfCurrWeekFull.getDate(); i <= lastDateOfCurrWeekFull.getDate(); i++) {
		weekInfo.currWeek.push(i);
	}
	return addMonthAndYearOfCurrWeek(weekInfo, firstDateOfCurrWeekFull, lastDateOfCurrWeekFull);
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

function formatDate() {
	let formatedDate = new Date();
	return formatedDate.toISOString().split("T")[0];
}

export function displayDate(currWeekInfo) {
	const date = document.querySelector(".current-date");
	date.innerHTML = getDateToDisplay(currWeekInfo);
}

function getDateToDisplay(weekInfo) {
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

	const isTwoYearsAndMonths =
		weekInfo.firstMonth !== weekInfo.lastMonth && weekInfo.firstMonthsYear !== weekInfo.lastMonthsYear;
	const isTwoMonthsOneYear =
		weekInfo.firstMonth !== weekInfo.lastMonth && weekInfo.firstMonthsYear === weekInfo.lastMonthsYear;
	const twoMonthsAndYears = `${months[weekInfo.firstMonth]} ${weekInfo.firstMonthsYear} - ${
		months[weekInfo.lastMonth]
	} ${weekInfo.lastMonthsYear}`;
	const twoMonthsOneYear = `${months[weekInfo.firstMonth]} - ${
		months[weekInfo.lastMonth]
	} ${currFullDate.getFullYear()}`;
	const oneMonthOneYear = `${months[currFullDate.getMonth()]} ${currFullDate.getFullYear()}`;

	return isTwoYearsAndMonths ? twoMonthsAndYears : isTwoMonthsOneYear ? twoMonthsOneYear : oneMonthOneYear;
}
