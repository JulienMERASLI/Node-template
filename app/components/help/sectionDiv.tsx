import classNames from "classnames";
import { createContext, FunctionComponent, ReactElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import { StateUpdater } from "remix.env";

const ExpandedContext = createContext([false, () => null] as [boolean, StateUpdater<boolean>]);
export const UrlHashContext = createContext(["", () => "", () => null] as [string, StateUpdater<string>, (newHash: string) => void]);

export const SectionDiv: FunctionComponent<{
	id?: string,
	isIntro?: boolean,
	sectionTitle: string,
	level: number,
	expandedByDefault?: boolean }> = ({ id, isIntro = false, sectionTitle, level, children, expandedByDefault = false }) => {
		const hasSectionChilds = (Array.isArray(children) ? children : [children])
			.some(child => {
				const { type } = (child as ReactElement);
				if (typeof type === "function") {
					return type.name === "SectionDiv";
				}
				return false;
			});
		const [hash, setHash] = useContext(UrlHashContext);
		const [parentExpanded, setParentExpanded] = useContext(ExpandedContext);
		const div = useRef<HTMLDivElement>(null);
		const [expanded, setExpanded] = useState(expandedByDefault);
		const paragraph = useRef<HTMLDivElement>(null);
		const HeadingTag = `h${level}` as "h2";

		const onTitleClick = useCallback(() => {
			setExpanded(!expanded);
			return true;
		}, [setExpanded, expanded]);

		useEffect(() => {
			if (`#${id}` === hash && !expanded) {
				onTitleClick();
				setParentExpanded(true);
			}
		}, [id, expanded, onTitleClick, setParentExpanded, hash]);
		useEffect(() => {
			requestAnimationFrame(() => {
				if (expanded && !hasSectionChilds && setParentExpanded) div.current!.scrollIntoView();
			});
		}, [parentExpanded, hasSectionChilds, expanded, setParentExpanded]);
		useEffect(() => {
			if (expanded) setParentExpanded?.(expanded);
		}, [expanded, setParentExpanded]);
		const content = <>
			<HeadingTag className="sectionTitle" onClick={() => !isIntro && onTitleClick() && hash === `#${id}` && setHash("")}>{sectionTitle} {isIntro ? "" : <span className="expandButton">▼</span>}</HeadingTag>
			<div className={classNames("paragraph", { expanded: expanded || isIntro })} ref={paragraph}>{children}</div>
		</>;
		return (<div id={id} ref={div} className="sectionDivContainer">
			{!hasSectionChilds
				? content
				: <ExpandedContext.Provider value={[expanded, setExpanded]}>
					{content}
				</ExpandedContext.Provider>
			}
		</div>);
	};
