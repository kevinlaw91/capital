// Imports
var gulp = require("gulp"),
	svgSymbols = require('gulp-svg-symbols'),
	svgmin = require("gulp-svgmin"),
	rename = require("gulp-rename"),
	sass = require('gulp-sass');

/*
 * SVG Symbols Packing
 */

// Root directory for resources that need to be packed
var pack_root = "dev/packing/",
	pack_templates_dir = pack_root + "templates/",
	pack_output_dir = pack_root + "output/";

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

/*
 * Compile SCSS
 */

// Compile .scss files within src/stylesheets/scss
gulp.task('scss', function () {
	return gulp.src('src/stylesheets/scss/**/*.scss')
	           .pipe(sass().on('error', sass.logError))
	           .pipe(gulp.dest('src/stylesheets/compiled/'));
});

// .scss Watcher
gulp.task('scss:watch', function () {
	gulp.watch('src/stylesheets/scss/**/*.scss', ['scss']);
});


/*
 * Build
 */
gulp.task("build", ["scss"]);