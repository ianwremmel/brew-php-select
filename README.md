# brew-php-select [![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
Homebrew and the [homebrew-php tap](https://github.com/josegonzalez/homebrew-php) make it easy enough to install multiple versions of PHP, but they don't make it all that convenient to switch between them. Specifically, the instructions recommend altering your shell's path and your apache config every time you switch versions. This script automates that process and reboots apache for you (if it's running).

## Installation

Install from npm.

```bash
npm install -g brew-php-select
```

Then, add the following to your httpd.conf. (The following step will create ```/usr/local/php```.)

```bash
LoadModule php5_module /usr/local/php/libexec/apache2/libphp5.so
```

Finally, execute the following to ensure all the required symlinks exist (Use whichever php version you actually need.)

```bash
brew-php-select --set php52
```

## Example Usage

Display the available PHP brews:

```bash
brew-php-select
```

Set the active brew to PHP 5.3

```bash
brew-php-select --set php53
```
