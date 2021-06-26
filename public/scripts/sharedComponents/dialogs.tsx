import { useContext, useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { closeAlert, closeConfirm, closePrompt, DialogsStateContext } from "../utilities/dialogs";
import { Overlay } from "./overlay";

const Alert = (): JSX.Element => {
	const { alertText: { value: text } } = useContext(DialogsStateContext);
	return (<Overlay id={"alert"} classes={["dialog"]} isDialog={true} title={text} level={4} context={"alert"} noCancel={true} validateOnClick={() => closeAlert()}></Overlay>);
};

const Prompt = (): JSX.Element => {
	const { promptVisible: { value: visible }, promptText: { value: text }, promptDefaultValue: { value: defaultValue } } = useContext(DialogsStateContext);
	const input = useRef<HTMLInputElement>(null);
	useEffect(() => {
		input.current.value = defaultValue;
	}, [defaultValue, visible]);

	return (<Overlay id={"prompt"} classes={["dialog"]} isDialog={true} title={null} level={4} context={"prompt"} validateOnClick={() => closePrompt(input.current.value)}>
		<div class="inputContainer">
			<label for="promptInput"><h4 id="promptText">{text}</h4></label>
			<input type="text" id="promptInput" ref={input} />
		</div>
	</Overlay>);
};

const Confirm = (): JSX.Element => {
	const { confirmText: { value: text } } = useContext(DialogsStateContext);
	return (<Overlay id={"confirm"} classes={["dialog"]} isDialog={true} title={text} level={4} context={"confirm"} validateOnClick={() => closeConfirm(true)} cancelOnClick={() => closeConfirm(false)}></Overlay>);
};

const Loading = (): JSX.Element => (<Overlay id={"loading"} classes={["dialog"]} isDialog={true} title="Chargement..." titleId="loadingText" level={4} context={"loading"} noValidate={true} noCancel={true} >
	<img src="/images/loading.gif" alt="Loading" />
</Overlay>);

export const Dialogs = (): JSX.Element => (<>
	<Alert />
	<Prompt />
	<Confirm />
	<Loading />
</>);
