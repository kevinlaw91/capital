var gulp = require("gulp");
var svgSymbols = require('gulp-svg-symbols');
var svgmin = require("gulp-svgmin");
var rename = require("gulp-rename");

// root directory for resources that need to be packed
var pack_root = "dev/packing/";
var pack_templates_dir = pack_root + "templates/";
var pack_output_dir = pack_root + "output/";

gulp.task("bundle-svg", function(){
	var pack_name = "floor";

	return gulp.src(pack_root + pack_name + '.svg/*.svg')
		.pipe(svgSymbols({
			templates: [
				pack_templates_dir + 'svg-symbols.template'
			],
			transformData: function(svg) {
				return {
					id: svg.originalAttributes.id
				};
			}}))
        .pipe(svgmin({
	        plugins: [
		        { cleanupIDs: false },
		        { removeTitle: true }
	        ],
	        js2svg: {
		        pretty: true
	        }}))
		.pipe(rename({
			basename: pack_name,
			extname: ".svg"
			}))
		.pipe(gulp.dest(pack_output_dir));
});

// build script
gulp.task("build", ["bundle-svg"]);