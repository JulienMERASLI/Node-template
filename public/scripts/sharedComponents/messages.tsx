import { forwardRef } from "preact/compat";
import { JSX } from "preact/jsx-runtime";

const Message = forwardRef<HTMLHeadingElement, { className: string } & Omit<JSX.HTMLAttributes, "ref"> & { level: number }>(({ className, children, level, ...props }, ref) => {
	const HeadingTag = `h${level}` as "h2";
	return (<HeadingTag ref={ref} class={className} {...props}>{children}</HeadingTag>);
});

export const ErrorMessage = forwardRef<HTMLHeadingElement, JSX.HTMLAttributes & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="error" {...props}>{children}</Message>);
export const WarningMessage = forwardRef<HTMLHeadingElement, JSX.HTMLAttributes & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="warning" {...props}>{children}</Message>);
export const InformationMessage = forwardRef<HTMLHeadingElement, JSX.HTMLAttributes & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="information" {...props}>{children}</Message>);
