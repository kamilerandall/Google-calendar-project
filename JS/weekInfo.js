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
	console.log(currWeekInfo);
	return currWeekInfo;
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

	// const date = document.querySelector(".current-date");

	const isTwoYearsAndMonths = weekInfo?.firstMonthsYear && weekInfo.firstMonthsYear !== weekInfo.lastMonthsYear;
	const isTwoMonthsOneYear = weekInfo?.firstMonth;
	const twoMonthsAndYears = `${months[weekInfo.firstMonth]} ${weekInfo.firstMonthsYear} - ${
		months[weekInfo.lastMonth]
	} ${weekInfo.lastMonthsYear}`;
	const twoMonthsOneYear = `${months[weekInfo.firstMonth]} - ${
		months[weekInfo.lastMonth]
	} ${currFullDate.getFullYear()}`;
	const oneMonthOneYear = `${months[currFullDate.getMonth()]} ${currFullDate.getFullYear()}`;

	return isTwoYearsAndMonths ? twoMonthsAndYears : isTwoMonthsOneYear ? twoMonthsOneYear : oneMonthOneYear;
}

export function displayDate(currWeekInfo) {
	const date = document.querySelector(".current-date");
	date.innerHTML = getDateToDisplay(currWeekInfo);
}
