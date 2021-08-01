import classNames from "classnames";
import { FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { isElementVisible } from "../utilities/utilities";

export const Paragraph: FunctionComponent<{ title: string, imgSrc: string, imgAlt: string }> = ({ title, imgSrc, imgAlt, children }) => {
	const [alreadySeen, setAlreadySeen] = useState(false);
	const p = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function showParagraph() {
			if (!alreadySeen) {
				const visible = isElementVisible(p.current!);
				setAlreadySeen(visible);
			}
		}
		window.addEventListener("scroll", () => showParagraph());
		return window.removeEventListener("scroll", () => showParagraph());
	}, [alreadySeen]);

	return (<section class={classNames("paragraph", { visible: alreadySeen })}>
		<h2>{title}</h2>
		<div class="container">
			<img src={`/images/index/${imgSrc}.png`} alt={imgAlt} />
			<div ref={p}>
				<p>{children}</p>
			</div>
		</div>
	</section>);
};
