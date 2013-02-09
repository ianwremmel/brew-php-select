require 'shelljs/global'
_ = require 'lodash'

prefix = exec 'brew --prefix', silent: true
symlink_path = prefix.output.trim() + '/php'

filter_brews_for_php = (brew) ->
	return not (brew.indexOf('php') is  -1) && brew.length is 5

cellar = exec 'brew --cellar', silent: true
if cellar.code is 0
	cellar = cellar.output.trim()
	phps = _.filter(ls(cellar), filter_brews_for_php)
else
	cellar = false

remove_old_symlink = ->
	exec 'rm ' + symlink_path, silent: true

determine_minor_version = (brew) ->
	ls(cellar + '/' + brew).pop()

create_new_symlink = (brew) ->
	minor = determine_minor_version brew
	cmd = 'ln -s ' + cellar + '/' + brew + '/' + minor + ' ' + symlink_path;
	exec(cmd).code is 0

filter_ps_for_apache = (ps) ->
	ps.indexOf 'httpd' is not -1

restart_apache_if_running = ->
	ps = exec('ps auxc', silent: true).output.split(/\n/);
	ps = ps.filter filter_ps_for_apache

	if ps.length
		exec 'sudo apachectl restart'

deactivate_brew = (brew) ->
	exec('brew unlink ' + brew)

module.exports =
	is_brew_installed: () ->
		not (cellar.code is false)

	is_php_installed: () ->
		phps.length > 0

	activate_brew: (brew) ->
		exec('brew link ' + brew)

	deactivate_brews: () ->
		# not skipping the brew we're trying to activate in case its symlinks have
		# gotten partially removed. I don't know what this would happen, but it
		# seems like a not-unreasonable precaution.
		_(phps).each(deactivate_brew);

	change_apache_symlink: (brew) ->
		remove_old_symlink()
		create_new_symlink brew
		restart_apache_if_running()

	list_php_versions: () ->
		console.log 'Available PHP Versions'
		_(phps).each (brew) ->
			console.log brew

	display_current_version: () ->
		console.log 'Active PHP Version'
		exec "php --version | awk 'NR ==1 {print $2}'"
