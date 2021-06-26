import { JSX } from "preact/jsx-runtime";
import { forwardRef } from "preact/compat";
import { useRef, Ref, useEffect, useContext } from "preact/hooks";
import { ErrorMessage } from "./messages";
import { PWMatchContext } from "../forms/settings";

export const Username = ({ placeholder = "", isRequired = true }: { placeholder?: string, isRequired?: boolean }): JSX.Element => (<div>
	<label for="username">Pseudo:</label>
	<input type="text" placeholder={placeholder} name="username" id="username" required={isRequired} autofocus minLength={2} pattern="^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$" /><br />
</div>);

export const PW = forwardRef<HTMLInputElement, { confirm?: boolean, isNew?: boolean, placeholder?: boolean, isRequired?: boolean }>(({ confirm = false, isNew = false, placeholder = false, isRequired = true }, ref) => {
	const id = `PW${confirm ? "Confirm" : ""}`;
	return <div>
		<label for={id}>{confirm ? "Confirmation du mot de passe: " : `${isNew ? "Nouveau m" : "M"}ot de passe:`}</label>
		<input ref={ref} type="password" name={id} id={id} required={isRequired} minLength={4} placeholder={placeholder ? "********" : ""} />
	</div>;
});

export const PWWithConfirm = ({ form, errorMessage, isNew = false, placeholder = false, isRequired = true }: { form: Ref<HTMLFormElement>, errorMessage: Ref<HTMLHeadingElement>, isNew?: boolean, placeholder?: boolean, isRequired?: boolean }): JSX.Element => {
	const PWComponent = useRef<HTMLInputElement>(null);
	const PWConfirmComponent = useRef<HTMLInputElement>(null);
	const setPWMatch = useContext(PWMatchContext);

	useEffect(() => {
		form.current.querySelector("input.validate").addEventListener("click", (e: Event) => {
			const PWInput = PWComponent.current;
			const PWConfirmInput = PWConfirmComponent.current;
			const match = PWInput.value === PWConfirmInput.value;
			setPWMatch(match);
			if (!match) {
				e.preventDefault();
				errorMessage.current.style.display = "block";
				scrollTo({
					top: 0,
				});
				return false;
			}
		}, true);
	}, []);

	return (<>
		<PW ref={PWComponent} isNew={isNew} placeholder={placeholder} isRequired={isRequired} />
		<PW ref={PWConfirmComponent} confirm={true} placeholder={placeholder} isRequired={isRequired} />
	</>);
};

export const PWConfirmError = forwardRef<HTMLHeadingElement>((_, ref) => <ErrorMessage ref={ref} style={{ display: "none" }}>Le mot de passe et la confirmation doivent correspondre</ErrorMessage>);

export const Email = ({ placeholder = "", isRequired = true }: { placeholder?: string, isRequired?: boolean }): JSX.Element => (<div>
	<label for="email">Email:</label>
	<input placeholder={placeholder} type="email" name="email" id="email" required={isRequired} autofocus />
</div>);

export const Validate = ({ onClick }: { onClick?: (e: MouseEvent) => void }): JSX.Element => (<div>
	<input type="submit" value="Valider" class="validate blue" onClick={(e) => {
		if (onClick) {
			onClick(e);
			e.preventDefault();
		}
	}} />
</div>);
