export default function emailRegex(options) {
	options = {
		exact: false,
		allowInternalDomain: true,
		allowAmpersandEntity: true,
		...options
	};

	// RFC 5322 (https://datatracker.ietf.org/doc/html/rfc5322)
	const alpha = '[A-Za-z]';
	const digit = String.raw`\d`;
	const atext = String.raw`(?:${alpha}|${digit}|!|#|\$|%|&|'|\*|\+|-|\/|=|\?|\^|_|\`|{|\||}|~${options.allowAmpersandEntity ? '|&amp;' : ''})`;
	const dotAtomText = String.raw`(?:${atext}+(?:\.${atext}+)+)`;
	const dotAtom = `${dotAtomText}`;
	const dquote = '"';
	const sp = ' ';
	const htab = String.raw`\u0009`;
	const wsp = `(?:${sp}|${htab})`;
	const cr = String.raw`\u000D`;
	const lf = String.raw`\u000A`;
	const crlf = `(?:${cr}${lf})`;
	const obsFws = `(?:${wsp}+(?:${crlf}${wsp}+)*)`;
	const fws = `(?:(?:(?:${wsp}*${crlf})?${wsp}+)|${obsFws})`;
	const obsNoWsCtl = String.raw`(?:[\u0001-\u0008]|\u000B|\u000C|[\u000E-\u001F]|\u007F)`;
	const obsQtext = `${obsNoWsCtl}`;
	const qtext = String.raw`(?:!|[\x23-\x5b]|[\x5d-\x7e]|${obsQtext})`;
	const vchar = String.raw`[\u0021-\u007E]`;
	const obsQp = String.raw`(?:\\(?:\x00|${obsNoWsCtl}|${lf}|${cr}))`;
	const quotedPair = String.raw`(?:(?:\\(?:${vchar}|${wsp}))|${obsQp})`;
	const qcontent = `(?:${qtext}|${quotedPair})`;
	const quotedString = `(?:${dquote}(?:${fws}?${qcontent})*${fws}?${dquote})`;
	const atom = `${atext}+`;
	const word = `(?:${atom}|${quotedString})`;
	const obsLocalPart = String.raw`(?:${word}(?:\.${word})*)`;
	const localPart = `(?:${dotAtom}|${quotedString}|${obsLocalPart})`;
	const obsDtext = `(?:${obsNoWsCtl}|${quotedPair})`;
	const dtext = String.raw`(?:[\x21-\x5a]|[\x5e-\x7e]|${obsDtext})`;
	const domainLiteral = String.raw`(?:\[(?:${fws}?${dtext})*${fws}?])`;
	const obsDomain = String.raw`(?:${atom}(?:\.${atom})${options.allowInternalDomain ? '*' : '+'})`;
	const domain = `(?:${dotAtom}|${domainLiteral}|${obsDomain})`;
	const addrSpec = `${localPart}@${domain}`;

	return options.exact ? new RegExp(`^${addrSpec}$`) : new RegExp(addrSpec, 'g');
}
