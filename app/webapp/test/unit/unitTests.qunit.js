/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"treinamento/l4e/app/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
