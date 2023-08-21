export let eventModalVisible = false;

function setEvenModalVisible(visible) {
	eventModalVisible = visible;

	// side-effect
	const eventModal = document.querySelector(".event-creation");
	eventModal.style.display = visible ? "block" : "none";
}

export let activeEvent = null;

export function setActiveEvent(event) {
	activeEvent = event;

	// side-effect
	if (event === null) {
		setEvenModalVisible(false);
	} else {
		setEvenModalVisible(true);
	}
}

export const currFullDate = new Date();

export function getNewFullDate(direction) {
	const currDate = currFullDate.getDate();
	currFullDate.setDate(currDate + direction);
}



