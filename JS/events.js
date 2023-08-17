"use strict";

let selectedEventId;

export function showCreateEventModal(div) {
	let save;
	const eventModal = document.querySelector(".event-creation");
	changeVisibility(eventModal);

	const wasEmptySlot = div.className !== "created-event";

	if (wasEmptySlot) {
		hideDeleteBtn();
		selectedEventId = takeSpace(div);
		addTitleToCreatedEvent(selectedEventId);
	} else {
		activateDeleteBtn(eventModal, selectedEventId);
		selectedEventId = div.id;
		document.querySelector(".event-title").value = div.innerText;
	}
	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		if (wasEmptySlot) {
			releaseSpace(selectedEventId);
		}
		emptyTitleInput();
		hideCreateEventModal(eventModal);
	};

	const saveBtn = document.querySelector(".save-event-btn");
	saveBtn.onclick = () => {
		save = true;
		const inputedEventTitle = document.querySelector(".event-title");
		addTitleToCreatedEvent(selectedEventId, inputedEventTitle.value);
		hideCreateEventModal(eventModal);
		selectedEventId = "";
		emptyTitleInput();
	};
	// console.log("prev cl", previouslyClickedEmpty);
	// console.log("save", !save);
	// if (previouslyClickedEmpty && !save) {
	// 	releaseSpace(selectedEventId);
	// }
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function activateDeleteBtn(eventModal, selectedEventId) {
	console.log(selectedEventId);
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "block";
	deleteBtn.onclick = () => {
		releaseSpace(selectedEventId);
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

function addTitleToCreatedEvent(selectedEventId, title = "(no title)") {
	const currEvent = document.getElementById(selectedEventId);
	currEvent.innerText = `${title}`;
}

function releaseSpace(selectedEventId) {
	console.log(selectedEventId);
	document.getElementById(selectedEventId).remove();
	emptyTitleInput();
}

function emptyTitleInput() {
	const inputedEventTitle = document.querySelector(".event-title");
	inputedEventTitle.value = "";
}

function hideCreateEventModal(eventModal) {
	changeVisibility(eventModal);
}

function changeVisibility(element) {
	element.style.display = element.style.display === "block" ? "none" : "block";
}
