# brew-php-select
Easily switches between homebrew-installed php versions

## Installation

The package is not yet in NPM, so install it directory from github:

```bash
npm install -g  http://github.com/ianwremmel/brew-php-select/tarball/master
```

## Usage

```bash
brew-php-select
```

Displays the available PHPs

```bash
brew-php-select --set php53
```

Sets the current php version to 5.3

## Apache

To allow apache to easily switch between versions, add the following to httpd.conf.

```bash
LoadModule php5_module /usr/local/php/libexec/apache2/libphp5.so
```

```/usr/local/php``` will be point to the latest minor version of php available for the selected major version.