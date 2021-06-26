/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-properties */
export function cloneDeep(item: any): any {
	if (!item) { return item; }

	const types = [Number, String, Boolean];
	let result;

	types.forEach((type) => {
		if (item instanceof type) {
			result = type(item);
		}
	});

	if (typeof result === "undefined") {
		if (Object.prototype.toString.call(item) === "[object Array]") {
			result = [];
			item.forEach((child, index) => {
				result[index] = cloneDeep(child);
			});
		} else if (typeof item === "object") {
			if (item.nodeType && typeof item.cloneNode === "function") {
				result = item.cloneNode(true);
			} else if (!item.prototype) {
				if (item instanceof Date) {
					result = new Date(item);
				} else {
					result = {};
					for (const i in item) {
						result[i] = cloneDeep(item[i]);
					}
				}
			} else {
				result = item;
			}
		} else {
			result = item;
		}
	}

	return result;
}

export const replaceLast = (str: string, what: string, replacement: string): string => {
	const pcs = str.split(what);
	const lastPc = pcs.pop();
	return pcs.join(what) + replacement + lastPc;
};

export function invertHex(hex: string): string {
	const invertedColor = (Number(`0x1${hex.replace("#", "")}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
	return `#${invertedColor}`;
}

function serializer(replacer, cycleReplacer) {
	const stack = []; const
		keys = [];

	if (cycleReplacer == null) { cycleReplacer = function (key, value) {
		if (stack[0] === value) return "[Circular ~]";
		return `[Circular ~.${keys.slice(0, stack.indexOf(value)).join(".")}]`;
	}; }

	return function (key, value) {
		if (stack.length > 0) {
			const thisPos = stack.indexOf(this);
			~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
			~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
			if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
		}
		else stack.push(value);

		return replacer == null ? value : replacer.call(this, key, value);
	};
}

export function stringify(obj: unknown, replacer?: (string | number)[], spaces?: string | number, cycleReplacer?: unknown): string {
	return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
}

export function deepAssign(target, ...sources) {
	for (const source of sources) {
		for (const k in source) {
			const vs = source[k]; const
				vt = target[k];
			if (Object(vs) === vs && Object(vt) === vt) {
				target[k] = deepAssign(vt, vs);
				// eslint-disable-next-line no-continue
				continue;
			}
			target[k] = source[k];
		}
	}
	return target;
}

function componentToHex(c) {
	const hex = c.toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(rbgString: string): string {
	const [r, g, b] = rbgString.replace("rgb(", "").replace(")", "").split(",").map(s => parseFloat(s.trim()));
	return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function stopEvent(e: Event): void {
	e.preventDefault();
	e.stopPropagation();
}

export function isElementVisible(elm: Element): boolean {
	const rect = elm.getBoundingClientRect();
	const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export function setAttributes(element: Element, attributes: Record<string, string>): void {
	Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
}

export function setStyles(element: HTMLElement | SVGElement, styles: Partial<CSSStyleDeclaration>): void {
	Object.keys(styles).forEach(style => {
		if (element) element.style[style] = styles[style];
	});
}
