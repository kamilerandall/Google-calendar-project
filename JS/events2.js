"use strict";

import { activeEvent, eventModalVisible, setActiveEvent } from "./state.js";

export function openMakeEventModal(clickedEl) {
	setDate(clickedEl);
	setTime(clickedEl);
	if (!eventModalVisible) {
		const wasEmptySlot = clickedEl.className === "cell";
		console.log(wasEmptySlot);
		if (wasEmptySlot) {
			setActiveEvent(createNewEvent(clickedEl));
		} else if (!wasEmptySlot) {
			setActiveEvent(modifyEvent(clickedEl));
		}
	} else {
		if (activeEvent.isNew) {
			releaseSpace(activeEvent.id);
		}
		setActiveEvent(null);
		emptyTitleInput();
	}
}

function exitModal() {
	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		if (activeEvent.isNew) {
			releaseSpace(activeEvent.id);
		}
		emptyTitleInput();
		setActiveEvent(null);
	};
}

function saveEvent(clickedSpot) {
	const saveBtn = document.querySelector(".save-event-btn");
	saveBtn.onclick = () => {
		//activeEvent.isNew = false;

		setActiveEvent({ ...activeEvent, isNew: false });

		const inputedEventTitle = document.querySelector(".event-title");
		const title = inputedEventTitle.value ? inputedEventTitle.value : "(no title)";
		addTitleToCreatedEvent(activeEvent.id, title);

		setActiveEvent(null);
		emptyTitleInput();
	};
}

function createNewEvent(clickedSpot) {
	hideDeleteBtn();
	const eventId = takeEmptySlot(clickedSpot);
	addTitleToCreatedEvent(eventId);
	saveEvent(clickedSpot);
	exitModal();
	return { id: eventId, isNew: true };
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function takeEmptySlot(clickedSpot) {
	let [date, time] = clickedSpot.id.split(" ");
	if (clickedSpot.firstChild) {
		time = getThirtyMinMore(time);
	}
	const newEvent = document.createElement("div");
	newEvent.className = "created-event";
	newEvent.id = `${date} ${time} event`;
	clickedSpot.appendChild(newEvent);
	return newEvent.id;
}

function addTitleToCreatedEvent(eventId, title = "(no title)") {
	const currEvent = document.getElementById(eventId);
	currEvent.innerText = `${title} | ${getClickedSpotTime(eventId)}`;
}

function modifyEvent(clickedEvent) {
	activateDeleteBtn(clickedEvent.id);
	showSelectedEventNameInModal(clickedEvent);
	saveEvent(clickedEvent);
	exitModal();
	return { id: clickedEvent.id, isNew: false };
}

function activateDeleteBtn(selectedEventId) {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "block";
	deleteBtn.onclick = () => {
		releaseSpace(selectedEventId);
		setActiveEvent(null);
	};
}

function showSelectedEventNameInModal(clickedEvent) {
	const onlyTitle = clickedEvent.innerText.split("|")[0];
	const title = onlyTitle.trim() === "(no title)" ? "" : onlyTitle;
	document.querySelector(".event-title").value = title;
}

function releaseSpace(selectedEventId) {
	document.getElementById(selectedEventId).remove();
	emptyTitleInput();
}

function emptyTitleInput() {
	const inputedEventTitle = document.querySelector(".event-title");
	inputedEventTitle.value = "";
}

function setDate(clickedSpot) {
	const eventDate = document.querySelector(".event-date");
	eventDate.value = clickedSpot.id.split(" ")[0];
}

function setTime(clickedSpot) {
	const eventStartTime = document.querySelector(".event-start-time");
	const eventEndTime = document.querySelector(".event-end-time");
	eventStartTime.value = getClickedSpotTime(clickedSpot.id);
	eventEndTime.value = getThirtyMinMore(eventStartTime.value);
}

function getClickedSpotTime(id) {
	return id.split(" ")[1];
}

// function getEndTime() {
// 	const eventEndTime = document.querySelector(".event-end-time");
// 	// 	eventEndTime.onchange = () => {
// 	// 		// console.log(eventEndTime.value);
// 	// 	};
// }

function getThirtyMinMore(eventStart) {
	let endTime;
	const [hour, min] = eventStart.split(":");
	endTime = `${hour}:30`;

	return endTime;
}



function getEventHeight() {}
