import classNames from "classnames";
import { Context, createContext, FunctionComponent, useCallback, useContext, useEffect, useRef, useState } from "react";

import { LinksFunction } from "remix";
import { StateUpdater } from "remix.env";
import { DialogsState, DialogsStateContext } from "~/utils/dialogs";
import styles from "~/styles/overlay.css";

export const links: LinksFunction = () => [{
	rel: "stylesheet",
	href: styles,
}];

function clearInputs(overlay: HTMLElement): void {
	Array.from(overlay.querySelectorAll("input")).forEach(v => {
		v.value = v.defaultValue;
		if (v.type === "checkbox") v.checked = v.defaultChecked;
		v.blur();
	});
}

export type State<T, U extends string> = {
	[key in U]: T;
} & {
	[key in `set${Capitalize<U>}`]: StateUpdater<T>;
}

export type OverlayContext = State<boolean, "visible">;

export const OverlayContainerVisibleContext = createContext<StateUpdater<boolean>>(() => true);

type OverlayProps = {
	id: string;
	classes?: string[];
	title: string | null;
	titleId?: string;
	level: number;
	isDialog?: boolean;
	validateOnClick?: (overlay: HTMLDivElement) => void;
	cancelOnClick?: (overlay: HTMLDivElement) => void;
	closeOnValidate?: boolean;
	noValidate?: boolean;
	noCancel?: boolean;
	beforeOpening?: (overlay: HTMLDivElement) => void;
	context?: Context<OverlayContext>;
}

export const OverlayContainer: FunctionComponent = ({ children }) => {
	const [overlayContainerVisible, setOverlayContainerVisible] = useState(false);

	return (
		<OverlayContainerVisibleContext.Provider value={setOverlayContainerVisible}>
			<div id="overlay" className={classNames({ visible: overlayContainerVisible })}>
				{children}
			</div>
		</OverlayContainerVisibleContext.Provider>
	);
};

export const Overlay: FunctionComponent<OverlayProps> = ({
	id,
	classes = [],
	title,
	titleId,
	level,
	children,
	isDialog = false,
	validateOnClick = () => true,
	cancelOnClick = () => true,
	closeOnValidate = true,
	noCancel = false,
	noValidate = false,
	beforeOpening = () => true,
	context }) => {
	const setOverlayContainerVisible = useContext(OverlayContainerVisibleContext);
	let visible: boolean;
	let setVisible: StateUpdater<boolean>;
	const overlayContext = useContext(context as Context<OverlayContext> || DialogsStateContext);
	if ("alertVisible" in overlayContext) {
		type VisibleContexts = keyof Pick<DialogsState, `${"alert" | "prompt" | "confirm" | "loading"}Visible`>;
		({ value: visible, setValue: setVisible } = (overlayContext as DialogsState)[`${id}Visible` as VisibleContexts]);
	} else {
		({ visible, setVisible } = overlayContext);
	}

	const overlay = useRef<HTMLDivElement>(null);
	const HeadingTag = `h${level}`as "h2";

	useEffect(() => {
		function toggleVisible() {
			const numberOfOverlayVisible = document.querySelectorAll(".overlay.visible").length;
			if (numberOfOverlayVisible === 0 || visible) {
				setOverlayContainerVisible(visible);
				document.querySelector("main")!.classList.toggle("behindOverlay", visible);
				document.body.style.overflow = visible ? "hidden" : "auto";
			}
		}
		const numberOfOverlayVisible = document.querySelectorAll(".overlay.visible").length;
		if (visible || numberOfOverlayVisible >= 0) toggleVisible();
	}, [visible, setOverlayContainerVisible]);

	const validateClickHandler = useCallback(() => {
		validateOnClick(overlay.current!);
		if (closeOnValidate) {
			setVisible(false);
		}
	}, [setVisible, closeOnValidate, validateOnClick]);

	const cancelClickHandler = useCallback(() => {
		cancelOnClick(overlay.current!);
		setVisible(false);
	}, [setVisible, cancelOnClick]);

	useEffect(() => {
		function onkeydown(e: KeyboardEvent) {
			if (e.key === "Enter" && !noValidate) validateClickHandler();
			else if (e.key === "Escape" && !noCancel) cancelClickHandler();
		}
		if (visible) {
			window.addEventListener("keydown", onkeydown);
		} else window.removeEventListener("keydown", onkeydown);
	}, [visible, noCancel, noValidate, cancelClickHandler, validateClickHandler]);

	useEffect(() => {
		const firstInput = overlay.current!.querySelector("input");
		if (firstInput && firstInput.type !== "submit") firstInput.focus();
	}, [visible]);

	useEffect(() => {
		if (visible) beforeOpening(overlay.current!);
		else clearInputs(overlay.current!);
	}, [visible, beforeOpening]);

	return (<div ref={overlay} id={`${id}Overlay`} className={classNames("overlay", { visible }, classes)}>
		{title && <HeadingTag className="headingTag" id={titleId}>{title}</HeadingTag>}
		<div>
			<div>
				{children}
			</div>
			{!noValidate && <input type="submit" className="validate rounded" value={isDialog ? "OK" : "Valider"} onClick={validateClickHandler} />}
		</div>
		{!noCancel && <button className="cancel rounded" onClick={cancelClickHandler}>Annuler</button>}
	</div>);
};
