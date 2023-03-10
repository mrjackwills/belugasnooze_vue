<p align="center">
	<img src='./.github/logo.svg' width='125px' />
</p>

<h1 align="center">Beluga Snooze website</h1>

<p align="center">
	The frontend PWA for <a href='https://www.belugasnooze.com' target='_blank' rel='noopener noreferrer'>Beluga Snooze</a>, powered by <a href='https://www.staticpi.com' target='_blank' rel='noopener noreferrer'>staticPi.com</a>
	<br>
	See the backend Rust source <a href='https://www.github.com/mrjackwills/belugasnooze_pi' target='_blank' rel='noopener noreferrer'>here</a>
</p>
<p align="center">
	Built using <a href='https://vuejs.org/' target='_blank' rel='noopener noreferrer'>Vue.js</a> and <a href='https://www.typescriptlang.org/' target='_blank' rel='noopener noreferrer'>Typescript</a>
</p>

## Screenshot
<p align="center">
	<a href="https://raw.githubusercontent.com/mrjackwills/belugasnooze_vue/main/.github/screenshot.png" target='_blank' rel='noopener noreferrer'>
		<img src='./.github/screenshot.png' width='50%'/>
	</a>
</p>

<p align="center">
	<ul>
		<li><strong>A+</strong> <a href='https://www.ssllabs.com/ssltest/analyze.html?d=www.belugasnooze.com' target='_blank' rel='noopener noreferrer'>ssllabs</a> rating</li>
		<li><strong>A+</strong> <a href='https://securityheaders.com/?q=https%3A%2F%2Fwww.belugasnooze.com%2F&followRedirects=on' target='_blank' rel='noopener noreferrer'>security headers</a> rating</li>
		<li><strong>A+</strong> <a href='https://observatory.mozilla.org/analyze/www.belugasnooze.com' target='_blank' rel='noopener noreferrer'>Mozilla observatory</a> rating</li>
	</ul>
</p>

## Required services

1) <a href='https://www.staticpi.com/' target='_blank' rel='noopener noreferrer'>staticPi</a> - the simple and secure messaging service


File that are required by Beluga Snooze
| file | reason |
|---|---|
|```./.env.development```	| development environmental variables|
|```./.env.development```	| productions environmental variables|

### Development
---

```npm run serve```

### Build step
---
```node build``` or ```npm run build```