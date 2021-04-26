/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function setStyles(element: HTMLElement | SVGElement, styles: Partial<CSSStyleDeclaration>): void {
	Object.keys(styles).forEach(style => {
		if (element) element.style[style] = styles[style];
	});
}

function DOMparseChildren(children) {
	return children.map(child => {
		if (typeof child === "string") {
			return document.createTextNode(child);
		}
		return child;
	});
}

function nonNull(val, fallback) { return val || fallback; }

function DOMparseNode(element, properties, children) {
	const el = document.createElement(element);
	Object.keys(nonNull(properties, {})).forEach(key => {
		if (key === "style") setStyles(el, properties[key]);
		else if (key in el) el[key] = properties[key];
		else el.setAttribute(key, properties[key]);
	});
	DOMparseChildren(children).forEach(child => {
		if (Array.isArray(child)) {
			if (Array.isArray(child[0])) {
				child[0].forEach(c => el.append(c));
			}
			else {
				child.forEach(c => el.append(c));
			}
		}
		else el.append(child);
	});
	return el;
}

function DOMcreateElement(element, properties, ...children) {
	const newProps = {};
	Object.keys(properties || {}).forEach((prop) => {
		if (prop.startsWith("on")) newProps[prop.toLowerCase()] = properties[prop];
		else newProps[prop] = properties[prop];
	});
	properties = newProps;
	if (typeof element === "function") {
		return element({
			...nonNull(properties, {}),
			children,
		});
	}
	return DOMparseNode(element, properties, children);
}
