export type Options = {
	/**
	Only match an exact string.

	Useful with `RegExp#test` to check if a string is an email address.

	@default false
	*/
	readonly exact?: boolean;

	/**
	Allow emails with a domain that doesn't have a dot, such as `user@localhost` or `user@internal`.

	@default true
	*/
	readonly allowSingleLabelDomain?: boolean;

	/**
	Allow the ampersand HTML entity `&amp;` to correspond to an ampersand `&` in the email address.

	@default false
	*/
	readonly allowAmpersandEntity?: boolean;
};

/**
Regular expression for matching email addresses.

Use it for finding email addresses or checking if something is email like. [You shouldn't use this for validating emails.](http://davidcel.is/blog/2012/09/06/stop-validating-email-addresses-with-regex/) Only for hinting to the user.

@example
```
import emailRegex from 'email-regex';

// Contains an email address
emailRegex().test('unicorn sindresorhus@gmail.com');
//=> true

// Is an email address
emailRegex({exact: true}).test('sindresorhus@gmail.com');
//=> true

'unicorn sindresorhus@gmail.com cake john@doe.com rainbow'.match(emailRegex());
//=> ['sindresorhus@gmail.com', 'john@doe.com']
```
*/
export default function emailRegex(options?: Options): RegExp;
