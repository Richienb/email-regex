import test from 'ava';
import emailRegex from './index.js';

const fixtures = [
	'sindresorhus@gmail.com',
	'foo@bar',
	'test@about.museum',
	'test@nominet.org.uk',
	'test.test@sindresorhus.com',
	'test@255.255.255.255',
	'a@sindresorhus.com',
	'test@e.com',
	'test@xn--hxajbheg2az3al.xn--jxalpdlp',
	'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@sindresorhus.com',
	'!#$%&amp;`*+/=?^`{|}~@sindresorhus.com',
	'test@g--a.com',
	'a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hij',
	'123@sindresorhus.com',
	String.raw`"\a"@sindresorhus.com`,
	'""@sindresorhus.com',
	'"test"@sindresorhus.com',
	String.raw`"\""@sindresorhus.com`,
	'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklmn@sindresorhus.com',
	'test@iana.co-uk',
	'a@a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v',
	'test@foo-bar.com',
	'foo@x.solutions',
	'foo@[IPv6:2001:db8::2]',
	// https://github.com/sindresorhus/email-regex/issues/2#issuecomment-404654677
	'email@example.com',
	'firstname.lastname@example.com',
	'email@subdomain.example.com',
	'firstname+lastname@example.com',
	'email@123.123.123.123',
	'email@[123.123.123.123]',
	'"email"@example.com',
	'1234567890@example.com',
	'email@example-one.com',
	'_______@example.com',
	'email@example.name',
	'email@example.museum',
	'email@example.co.jp',
	'firstname-lastname@example.com',
	// 'very.unusual.”@”.unusual.com',
	'email@example',
	'email@-example.com',
	'email@example.web',
	'email@111.222.333.44444'
];

const fixturesCustomMatch = new Map([
	// https://github.com/sindresorhus/email-regex/issues/9#issue-569014279
	['f="nr@context",c=e("gos")', 'nr@context'],
	// https://github.com/sindresorhus/email-regex/issues/2#issuecomment-404654677
	[String.raw`very.”(),:;<>[]”.VERY.”very@\ "very”.unusual@strange.example.com`, 'unusual@strange.example.com'],
	['#@%^%#$@#$@#.com', '#@%^%#$'],
	['Joe Smith email@example.com', 'email@example.com'],
	['email@example@example.com', 'email@example'],
	['.email@example.com', 'email@example.com'],
	['email..email@example.com', 'email@example.com'],
	['email@example.com (Joe Smith)', 'email@example.com'],
	['just”not”right@example.com', 'right@example.com'],
	[String.raw`this\ is"really"not\allowed@example.com`, 'allowed@example.com']
]);

for (const [input, expected] of fixturesCustomMatch) {
	// If they match, we can't use them as notFixtures
	console.assert(input !== expected, `Custom match fixture "${input}" does not match expected "${expected}"`);
}

const fixturesNot = [
	'@',
	'@io',
	'@sindresorhus.com',
	'test..sindresorhus.com',
	'test@iana..com',
	'test@sindresorhus.com.',
	'.test@sindresorhus.com',
	'sindre@sindre@sindre.com',
	'mailto:sindresorhus@gmail.com',
	'foo.example.com',
	'test.@example.com',
	// https://github.com/sindresorhus/email-regex/issues/9#issue-569014279
	'f="nr@context",c=e("gos")',
	// https://github.com/sindresorhus/email-regex/issues/2#issuecomment-404654677
	'plainaddress',
	'@example.com',
	'email.example.com',
	'email@example..com',
	'email.@example.com',
	'あいうえお@example.com',
	'Abc..123@example.com',
	'”(),:;<>[]@example.com',
	'"(),:;<>[]@example.com',
	String.raw`much.”more\ unusual”@example.com`
];

test('extract', t => {
	for (const fixture of fixtures) {
		t.is((emailRegex().exec(`foo ${fixture} bar`) || [])[0], fixture);
	}

	for (const [input, expected] of fixturesCustomMatch) {
		t.is((emailRegex().exec(input) || [])[0], expected, input); // eslint-disable-line ava/assertion-arguments
	}

	t.is(emailRegex().exec('mailto:sindresorhus@gmail.com')[0], 'sindresorhus@gmail.com');
});

test('exact', t => {
	for (const fixture of fixtures) {
		t.true(emailRegex({exact: true}).test(fixture), fixture); // eslint-disable-line ava/assertion-arguments
	}
});

test('failures', t => {
	for (const fixture of fixturesNot) {
		t.false(emailRegex({exact: true}).test(fixture), fixture); // eslint-disable-line ava/assertion-arguments
	}

	for (const input of fixturesCustomMatch.keys()) {
		t.false(emailRegex({exact: true}).test(input), input); // eslint-disable-line ava/assertion-arguments
	}
});
