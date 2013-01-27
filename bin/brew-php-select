require('shelljs/global');
var _ = require('lodash');
var cli = require('cli');

var php_symlink = '/usr/local/php';

var options = {
	set: ['s', 'Set PHP Version', 'string']
};

// TODO improve the output of the various versions

// First, make sure we have Homebrew.
var cellar = exec('brew --cellar', {silent: true});
if (cellar.code !== 0) {
	console.error('brew --cellar failed. Is homebrew installed?');
	process.exit(1);
}

// Then, check if we have at least one version of PHP.
var phps = _.filter(ls(cellar.output.trim()), function(brew) {
	return (brew.indexOf('php') !== -1);
});

if (phps.length === 0) {
	console.error('No PHP installations found');
	process.exit(2);
}

// Finally, start processing user actions
options = cli.parse(options);

if (options.set) {
	if (!_.contains(phps, options.set)) {
		console.error('Specified PHP version was not found');
		process.exit(3);
	}

	_(phps).each(function(brew){
		exec('brew unlink ' + brew);
	});

	exec('brew link ' + options.set);

	// Determine latest minor version
	var basepath = cellar.output.trim();
	var minor = ls(basepath + '/' + options.set).pop();

	// Remove the old link if it exists
	exec('rm ' + php_symlink, {silent: true});

	// Link the specified php's minor version directory to somewhere where apache
	// will always find it.
	var cmd = 'ln -s ' + basepath + '/' + options.set + '/' + minor + ' ' + php_symlink;
	var result = exec(cmd);
	if (result.code !== 0) {
		console.error('Could not link apache module');
		console.error(result.output);
		process.exit(4);
	}

	// Restart apache if it was already running
	var ps = exec('ps auxc', {silent: true}).output.split(/\n/);
	ps = ps.filter(function(p) {
		return p.indexOf('httpd') !== -1;
	});

	if (ps.length) {
		exec('sudo apachectl restart');
	}
}
else {
	console.log(phps);
}