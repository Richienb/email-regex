export default function emailRegex(options) {
	options = {
		exact: false,
		allowLocalDomain: true,
		allowAmpersandEntity: false,
		...options,
	}

	// RFC 5322 (https://datatracker.ietf.org/doc/html/rfc5322)
	const alpha = '[A-Za-z]';
	const digit = '\\d';
	const atext = `(?:${alpha}|${digit}|!|#|\\$|%|&|'|\\*|\\+|-|\\/|=|\\?|\\^|_|\`|{|\\||}|~${options.allowAmpersandEntity ? '|&amp;' : ''})`;
	const dotAtomText = `(?:${atext}+(?:\\.${atext}+)+)`;
	const dotAtom = `${dotAtomText}`;
	const dquote = '"';
	const sp = ' ';
	const htab = '\\x09';
	const wsp = `(?:${sp}|${htab})`;
	const cr = '\\x0d';
	const lf = '\\x0a';
	const crlf = `(?:${cr}${lf})`;
	const obsFws = `(?:${wsp}+(?:${crlf}${wsp}+)*)`;
	const fws = `(?:(?:(?:${wsp}*${crlf})?${wsp}+)|${obsFws})`;
	const obsNoWsCtl = '(?:[\\x01-\\x08]|\\x0b|\\x0c|[\\x0e-\\x1f]|\\x7f)';
	const obsQtext = `${obsNoWsCtl}`;
	const qtext = `(?:!|[\\x23-\\x5b]|[\\x5d-\\x7e]|${obsQtext})`;
	const vchar = '[\\x21-\\x7e]';
	const obsQp = `(?:\\\\(?:\\x00|${obsNoWsCtl}|${lf}|${cr}))`;
	const quotedPair = `(?:(?:\\\\(?:${vchar}|${wsp}))|${obsQp})`;
	const qcontent = `(?:${qtext}|${quotedPair})`;
	const quotedString = `(?:${dquote}(?:${fws}?${qcontent})*${fws}?${dquote})`;
	const atom = `${atext}+`;
	const word = `(?:${atom}|${quotedString})`;
	const obsLocalPart = `(?:${word}(?:\\.${word})*)`;
	const localPart = `(?:${dotAtom}|${quotedString}|${obsLocalPart})`;
	const obsDtext = `(?:${obsNoWsCtl}|${quotedPair})`;
	const dtext = `(?:[\\x21-\\x5a]|[\\x5e-\\x7e]|${obsDtext})`;
	const domainLiteral = `(?:\\[(?:${fws}?${dtext})*${fws}?])`;
	const obsDomain = `(?:${atom}(?:\\.${atom})${options.allowLocalDomain ? '*' : '+'})`;
	const domain = `(?:${dotAtom}|${domainLiteral}|${obsDomain})`;
	const addrSpec = `(?:${localPart}@${domain})`;

	return options.exact ? new RegExp(`^${addrSpec}$`) : new RegExp(addrSpec, 'g');
}
