import classNames from "classnames";
import { FunctionComponent } from "preact";
import { useRef, useState } from "preact/hooks";

export const SectionDiv: FunctionComponent<{
	id?: string,
	isIntro?: boolean,
	sectionTitle: string,
	level: number }> = ({ id, isIntro = false, sectionTitle, level, children }) => {
		const [clickedOnce, setClickedOnce] = useState(false);
		const [expanded, setExpanded] = useState(false);
		const paragraph = useRef(null);
		const HeadingTag = `h${level}` as "h2";

		function onTitleClick() {
			setClickedOnce(true);
			setExpanded(!expanded);
			if (expanded) {
				setTimeout(() => {
					paragraph.current.style.display = "table-column";
				}, 200);
			} else paragraph.current.style.display = "block";
		}

		return (<div id={id}>
			<HeadingTag class="sectionTitle" onClick={() => !isIntro && onTitleClick()}>{sectionTitle} {isIntro ? "" : <span class="expandButton">▼</span>}</HeadingTag>
			<div class={classNames("paragraph", { clickedOnce, expanded: expanded || isIntro })} ref={paragraph}>{children}</div>
		</div>);
	};
