function serializer(replacer: ((key: string, value: unknown) => string) | undefined, cycleReplacer: ((key: string, value: unknown) => string) | undefined) {
	const stack: unknown[] = [];
	const keys: unknown[] = [];

	if (cycleReplacer == null) { cycleReplacer = function (key, value) {
		if (stack[0] === value) return "[Circular ~]";
		return `[Circular ~.${keys.slice(0, stack.indexOf(value)).join(".")}]`;
	}; }

	return function (this: unknown, key: string, value: unknown) {
		if (stack.length > 0) {
			const thisPos = stack.indexOf(this);
			if (~thisPos) {
				stack.splice(thisPos + 1);
				keys.splice(thisPos, Infinity, key);
			} else {
				stack.push(this);
				keys.push(key);
			}
			if (~stack.indexOf(value)) value = cycleReplacer!.call(this, key, value);
		}
		else stack.push(value);

		return replacer == null ? value : replacer.call(this, key, value);
	};
}

export function stringify(obj: unknown, replacer?: (key: string, value: unknown) => string, spaces?: string | number, cycleReplacer?: (key: string, value: unknown) => string): string {
	return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
}

export function isElementVisible(elm: Element): boolean {
	const rect = elm.getBoundingClientRect();
	const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
