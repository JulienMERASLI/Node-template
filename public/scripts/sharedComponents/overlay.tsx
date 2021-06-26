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

export const OverlayContainerVisibleContext = createContext<{
	setOverlayContainerVisible: StateUpdater<boolean>,
	numberOfOverlayVisible: number,
	setNumberOfOverlayVisible: StateUpdater<number>
}>({
	setOverlayContainerVisible: () => true,
	numberOfOverlayVisible: 0,
	setNumberOfOverlayVisible: () => 0,
});

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
	const [numberOfOverlayVisible, setNumberOfOverlayVisible] = useState(0);

	return (
		<OverlayContainerVisibleContext.Provider value={{ setOverlayContainerVisible, numberOfOverlayVisible, setNumberOfOverlayVisible }}>
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
	const { setOverlayContainerVisible, numberOfOverlayVisible, setNumberOfOverlayVisible } = useContext(OverlayContainerVisibleContext);
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

	function toggleVisible(newVisible = visible) {
		const newValue = Math.max(0, newVisible ? numberOfOverlayVisible + 1 : numberOfOverlayVisible - 1);
		setNumberOfOverlayVisible(newValue);
		if (newValue === 0 || newVisible) {
			setOverlayContainerVisible(newVisible);
			document.querySelector("main").classList.toggle("behindOverlay", newVisible);
			document.body.style.overflow = newVisible ? "hidden" : "auto";
		}
	}
	useEffect(() => {
		if (visible || numberOfOverlayVisible > 0) toggleVisible();
	}, [visible]);

	function validateClickHandler() {
		validateOnClick(overlay.current);
		if (closeOnValidate) {
			setVisible(false);
			toggleVisible(false);
		}
	}

	function cancelClickHandler() {
		cancelOnClick(overlay.current);
		setVisible(false);
		toggleVisible(false);
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
