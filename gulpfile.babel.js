/* eslint-env node */

// Imports
import del from "del";
import gulp from "gulp";
import rename from "gulp-rename";
import svgmin from "gulp-svgmin";

// SVG optimization
const svg = {
	RAW_DIR: "dev/svg/raw/",
	OPTIMIZE_DIR: "dev/svg/optimized/",
	ORGANIZE_DIR: "dev/svg/organized/",
	// Clean optimized svg output dir
	clean: () => {
		return del([
			svg.OPTIMIZE_DIR,
			svg.ORGANIZE_DIR
		]);
	},

	// Optimize SVG resources
	optimize: () => {
		return gulp
			.src(svg.RAW_DIR + "**/*.svg")
			.pipe(svgmin({
				plugins: [
					{
						removeTitle: true
					},
					{
						convertShapeToPath: false
					},
					{
						sortAttrs: true
					}
				],
				js2svg: {
					// Prettify output
					pretty: true
				}
			}))
			.pipe(gulp.dest(svg.OPTIMIZE_DIR));
	},

	// Organize output file into directories
	// Files with group id will be collected into a directory named by group id
	//
	// Valid patterns:
	// (name).svg
	// (groupid)_(name).svg
	organize: () => {
		return gulp
			.src(svg.OPTIMIZE_DIR + "**/*.svg")
			.pipe(rename((path) => {
				// Read group id and symbol name using RegExp
				const splitFields = /(?:(.+)(?=_))?_?(.*)$/;
				const result = splitFields.exec(path.basename);

				// Extract fields
				let name = "";
				let id = "";

				if (result.length < 2) {
					// No group id
					name = result[1];
				} else {
					id = result[1];
					name = result[2];
				}

				path.dirname += "/" + id.trim();
				path.basename = name;

				return path;
			}))
			.pipe(gulp.dest(svg.ORGANIZE_DIR));
	}
};

// Expose to CLI
gulp.task("svg:optimize", svg.optimize);
gulp.task("svg:clean", svg.clean);
gulp.task("svg:organize", svg.organize);
gulp.task("svg", gulp.series(svg.clean, svg.optimize, svg.organize));