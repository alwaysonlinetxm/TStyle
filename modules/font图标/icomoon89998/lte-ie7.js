/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-play' : '&#xe000;',
			'icon-pause' : '&#xe001;',
			'icon-stop' : '&#xe002;',
			'icon-backward' : '&#xe003;',
			'icon-forward' : '&#xe004;',
			'icon-first' : '&#xe005;',
			'icon-last' : '&#xe006;',
			'icon-previous' : '&#xe007;',
			'icon-next' : '&#xe008;',
			'icon-backward-2' : '&#xe009;',
			'icon-stop-2' : '&#xe00a;',
			'icon-pause-2' : '&#xe00b;',
			'icon-play-2' : '&#xe00c;',
			'icon-forward-2' : '&#xe00d;',
			'icon-shuffle' : '&#xe00e;',
			'icon-loop' : '&#xe00f;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};