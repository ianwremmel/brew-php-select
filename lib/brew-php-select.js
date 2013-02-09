require('shelljs/global');
var _ = require('lodash');

var prefix = exec('brew --prefix', {silent: true});
var symlink_path = prefix.output.trim() + '/php';

var filter_brews_for_php = function(brew) {
	return (brew.indexOf('php') !== -1 && brew.length == 5);
};

var cellar = exec('brew --cellar', {silent: true});
if (cellar.code === 0) {
	cellar = cellar.output.trim();
	var phps = _.filter(ls(cellar),filter_brews_for_php);
}
else {
	cellar = false;
}

var remove_old_symlink = function() {
	exec('rm ' + symlink_path, {silent: true});
};

var determine_minor_version = function(brew) {
	return ls(cellar + '/' + brew).pop();
};

var create_new_symlink = function(brew) {
	var minor = determine_minor_version(brew);
	var cmd = 'ln -s ' + cellar + '/' + brew + '/' + minor + ' ' + symlink_path;
	return (exec(cmd).code === 0);
};

var filter_ps_for_apache = function(ps) {
	return (ps.indexOf('httpd') !== -1);
};

var restart_apache_if_running = function() {
	var ps = exec('ps auxc', {silent: true}).output.split(/\n/);
	ps = ps.filter(filter_ps_for_apache);

	if (ps.length) {
		exec('sudo apachectl restart');
	}
};

var deactivate_brew = function(brew) {
	exec('brew unlink ' + brew);
};

module.exports = {
	is_brew_installed: function() {
		return (cellar.code !== false);
	},

	is_php_installed: function() {
		return (phps.length > 0);
	},

	activate_brew: function(brew) {
		exec('brew link ' + brew);
	},

	deactivate_brews: function() {
		// not skipping the brew we're trying to activate in case its symlinks have
		// gotten partially removed. I don't know what this would happen, but it
		// seems like a not-unreasonable precaution.
		_(phps).each(deactivate_brew);
	},

	change_apache_symlink: function(brew) {
		remove_old_symlink();
		create_new_symlink(brew);
		restart_apache_if_running();
	},

	list_php_versions: function() {
		console.log('Available PHP Versions');
		_(phps).each(function(brew) {
			console.log(brew);
		});
	},

	display_current_version: function() {
		console.log('Active PHP Version');
		exec("php --version | awk 'NR ==1 {print $2}'");
	}
};
