import { forwardRef, useEffect } from "react";
import { Form, FormProps, useTransition } from "remix";
import { toggleLoading } from "~/utils/dialogs";

export const Username = ({ placeholder = "", isRequired = true }: { placeholder?: string, isRequired?: boolean }) => (<div>
	<label htmlFor="username">Pseudo:</label>
	<input type="text" placeholder={placeholder} name="username" id="username"required={isRequired} autoFocus minLength={2} pattern="^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$" /><br />
</div>);

export const Password = ({ confirm = false, isNew = false, placeholder = false, isRequired = true }: { confirm?: boolean, isNew?: boolean, placeholder?: boolean, isRequired?: boolean }) => {
	const id = `PW${confirm ? "Confirm" : ""}`;
	return <div>
		<label htmlFor={id}>{confirm ? "Confirmation du mot de passe: " : `${isNew ? "Nouveau m" : "M"}ot de passe:`}</label>
		<input type="password" name={id} id={id} required={isRequired} minLength={4} placeholder={placeholder ? "********" : ""} />
	</div>;
};

export const Email = ({ placeholder = "", isRequired = true }: { placeholder?: string, isRequired?: boolean }): JSX.Element => (<div>
	<label htmlFor="email">Email:</label>
	<input placeholder={placeholder} type="email" name="email" id="email" required={isRequired} autoFocus />
</div>);

export const Validate = ({ onClick }: { onClick?: (e: React.MouseEvent) => void }): JSX.Element => (<div>
	<input type="submit" value="Valider" className="validate blue" onClick={(e) => {
		if (onClick) {
			onClick(e);
			e.preventDefault();
		}
	}} />
</div>);

export const FormWithLoading = forwardRef<HTMLFormElement, FormProps>(({ children, ...props }, ref) => {
	const transition = useTransition();
	useEffect(() => {
		toggleLoading(transition.state === "submitting");
	}, [transition]);
	return <Form {...props} ref={ref}>{children}</Form>;
});
