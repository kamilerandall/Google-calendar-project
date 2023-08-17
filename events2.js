"use strict";

let save;
let lastClickedEmpty;
let selectedEventId;

export function openMakeEventModal(clickedEl) {
    
	const eventModal = document.querySelector(".event-creation");
	changeEventModalVisibility();

	const wasEmptySlot = clickedEl.className === "cell";
	if (wasEmptySlot && eventModal.style.display === "block") {
		lastClickedEmpty = true;
		selectedEventId = createNewEvent(clickedEl);
	} else if (!wasEmptySlot && eventModal.style.display === "block") {
		lastClickedEmpty = false;
		selectedEventId = modifyEvent(clickedEl);
	} else {
		if (!save && lastClickedEmpty) {
			releaseSpace(selectedEventId);
		}
		emptyTitleInput();
	}
}

function saveEvent(selectedEventId) {
	const saveBtn = document.querySelector(".save-event-btn");
	save = false;
	saveBtn.onclick = () => {
		save = true;
		const inputedEventTitle = document.querySelector(".event-title");
		const title = inputedEventTitle.value ? inputedEventTitle.value : "(no title)";
		addTitleToCreatedEvent(selectedEventId, title);
		changeEventModalVisibility();
		emptyTitleInput();
	};
}

function createNewEvent(clickedSpot) {
	hideDeleteBtn();
	const eventId = takeEmptySlot(clickedSpot);
	addTitleToCreatedEvent(eventId);
	saveEvent(eventId);
	return eventId;
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function takeEmptySlot(clickedSpot) {
	const newEvent = document.createElement("div");
	newEvent.className = "created-event";
	newEvent.id = clickedSpot.id + "-event";
	clickedSpot.appendChild(newEvent);
	return newEvent.id;
}

function addTitleToCreatedEvent(eventId, title = "(no title)") {
	const currEvent = document.getElementById(eventId);
	currEvent.innerText = `${title}`;
}

function modifyEvent(clickedEvent) {
	activateDeleteBtn(clickedEvent.id);
	showSelectedEventNameInModal(clickedEvent);
	saveEvent(clickedEvent.id);
	return clickedEvent.id;
}

function activateDeleteBtn(selectedEventId) {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "block";
	deleteBtn.onclick = () => {
		releaseSpace(selectedEventId);
		changeEventModalVisibility();
	};
}

function showSelectedEventNameInModal(clickedEvent) {
	const title = clickedEvent.innerText === "(no title)" ? "" : clickedEvent.innerText;
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

function changeEventModalVisibility() {
	const eventModal = document.querySelector(".event-creation");
	eventModal.style.display = eventModal.style.display === "block" ? "none" : "block";
}
