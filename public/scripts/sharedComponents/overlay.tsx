import classNames from "classnames";
import { Context, createContext, FunctionComponent } from "preact";
import { StateUpdater, useContext, useEffect, useRef, useState } from "preact/hooks";
import { DialogsStateContext } from "../utilities/dialogs";

function clearInputs(overlay: HTMLElement): void {
	Array.from(overlay.querySelectorAll("input")).forEach(v => {
		v.value = v.defaultValue;
		if (v.type === "checkbox") v.checked = v.defaultChecked;
		v.blur();
	});
}

export type OverlayContext = {
	visible: boolean;
	setVisible: StateUpdater<boolean>;
}

export const OverlayContainerVisibleContext = createContext<StateUpdater<boolean>>(() => true);

type OverlayProps = {
	id: string;
	classes?: string[];
	title: string;
	titleId?: string;
	level: number;
	isDialog?: boolean;
	validateOnClick?: (overlay: HTMLDivElement) => void;
	cancelOnClick?: (overlay: HTMLDivElement) => void;
	closeOnValidate?: boolean;
	noValidate?: boolean;
	noCancel?: boolean;
	beforeOpening?: (overlay: HTMLDivElement) => void;
	context: Context<OverlayContext> | string;
}

export const OverlayContainer: FunctionComponent = ({ children }) => {
	const [overlayContainerVisible, setOverlayContainerVisible] = useState(false);

	return (
		<OverlayContainerVisibleContext.Provider value={setOverlayContainerVisible}>
			<div id="overlay" class={classNames({ visible: overlayContainerVisible })}>
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
	if (typeof context === "string") {
		const dialogContext = useContext(DialogsStateContext);
		({ value: visible, setValue: setVisible } = dialogContext[`${context}Visible`]);
	} else {
		({ visible, setVisible } = useContext(context));
	}

	const overlay = useRef<HTMLDivElement>(null);
	const HeadingTag = `h${level}`as "h2";

	function toggleVisible() {
		const numberOfOverlayVisible = document.querySelectorAll(".overlay.visible").length;
		if (numberOfOverlayVisible === 0 || visible) {
			setOverlayContainerVisible(visible);
			document.querySelector("main").classList.toggle("behindOverlay", visible);
			document.body.style.overflow = visible ? "hidden" : "auto";
		}
	}
	useEffect(() => {
		const numberOfOverlayVisible = document.querySelectorAll(".overlay.visible").length;
		if (visible || numberOfOverlayVisible >= 0) toggleVisible();
	}, [visible]);

	function validateClickHandler() {
		validateOnClick(overlay.current);
		if (closeOnValidate) {
			setVisible(false);
		}
	}

	function cancelClickHandler() {
		cancelOnClick(overlay.current);
		setVisible(false);
	}

	useEffect(() => {
		if (visible) {
			window.onkeydown = (e) => {
				if (e.key === "Enter" && !noValidate) validateClickHandler();
				else if (e.key === "Escape" && !noCancel) cancelClickHandler();
			};
		} else window.onkeydown = null;
	}, [visible]);

	useEffect(() => {
		const firstInput = overlay.current.querySelector("input");
		if (firstInput && firstInput.type !== "submit") firstInput.focus();
	}, [visible]);

	useEffect(() => {
		if (visible) beforeOpening(overlay.current);
		else clearInputs(overlay.current);
	}, [visible]);

	return (<div ref={overlay} id={`${id}Overlay`} class={classNames("overlay", { visible }, classes)}>
		{title && <HeadingTag class="headingTag" id={titleId}>{title}</HeadingTag>}
		<div>
			<div>
				{children}
			</div>
			{!noValidate && <input type="submit" class="validate rounded" value={isDialog ? "OK" : "Valider"} onClick={validateClickHandler} />}
		</div>
		{!noCancel && <button class="cancel rounded" onClick={cancelClickHandler}>Annuler</button>}
	</div>);
};
