"use strict";

let clicked = false;
let selectedEventId;

export function showCreateEventModal(div) {
	let save = false;
	const eventModal = document.querySelector(".event-creation");

	clicked = !clicked;

	let wasEmptySlot = div.className === "created-event" ? false : true;

	if (wasEmptySlot) {
		hideDeleteBtn();
		if (clicked) {
			changeVisibility(eventModal);
			selectedEventId = takeSpace(div);
			addTitleToCreatedEvent();
		} else {
			changeVisibility(eventModal);
			if (!save) {
				releaseSpace();
			}
		}
	} else {
		changeVisibility(eventModal);
		activateDeleteBtn(eventModal);
		selectedEventId = div.id;
		document.querySelector(".event-title").value = div.innerText;
	}

	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		if (wasEmptySlot) {
			releaseSpace();
		}
		emptyTitleInput();
		hideCreateEventModal(eventModal);
	};

	const saveBtn = document.querySelector(".save-event-btn");
	saveBtn.onclick = () => {
		save = true;
		const inputedEventTitle = document.querySelector(".event-title");
		addTitleToCreatedEvent(inputedEventTitle.value);
		hideCreateEventModal(eventModal);
		selectedEventId = "";
		emptyTitleInput();
	};
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function activateDeleteBtn(eventModal) {
	const deleteBtn = document.querySelector(".delete-btn");
	changeVisibility(deleteBtn);
	deleteBtn.onclick = () => {
		releaseSpace();
		hideCreateEventModal(eventModal);
	};
}

function takeSpace(div) {
	const createdEvent = document.createElement("div");
	createdEvent.className = "created-event";
	createdEvent.id = div.id + "-event";
	div.appendChild(createdEvent);
	return createdEvent.id;
}

function addTitleToCreatedEvent(title) {
	const currEvent = document.getElementById(selectedEventId);
	if (!title) {
		currEvent.innerText = `(no title)`;
	} else {
		currEvent.innerText = `${title}`;
	}
}

function releaseSpace() {
	document.getElementById(selectedEventId).remove();
	emptyTitleInput();
}

function emptyTitleInput() {
	const inputedEventTitle = document.querySelector(".event-title");
	inputedEventTitle.value = "";
}

function hideCreateEventModal(eventModal) {
	changeVisibility(eventModal);
	clicked = !clicked;
}

function changeVisibility(element) {
	element.style.display = element.style.display === "block" ? "none" : "block";
}
