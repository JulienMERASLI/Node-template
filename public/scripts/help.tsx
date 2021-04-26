const expandButtons = document.querySelectorAll("span.expandButton");
const paragraphs = Array.from(document.querySelectorAll("div.paragraph")).slice(1);
expandButtons.forEach((button, i) => {
	button.parentElement.onclick = () => {
		paragraphs[i].classList.add("clickedOnce");
		if (paragraphs[i].classList.contains("expanded")) {
			paragraphs[i].classList.remove("expanded");
			setTimeout(() => {
				paragraphs[i].style.display = "table-column";
			}, 150);
		} else {
			paragraphs[i].classList.add("expanded");
			paragraphs[i].style.display = "block";
		}
	};
});
