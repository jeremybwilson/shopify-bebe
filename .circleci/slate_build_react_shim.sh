#!/bin/bash 
echo "Current DIR: "
pwd
echo " "
echo " "
cd ./node_modules/@shopify/slate-tools/lib/tasks
echo "
_______________________SLATE v0.14 REACT SHIM_____________________
SHIMMING...
  Target: $(pwd)
  
UPDATED:"
sed -i '' "s/.pipe(include()).pipe(gulp.dest(config.dist.assets))/.pipe(babel({presets:['env','react']})).pipe(include()).pipe(browserify({transform: ['reactify']})).pipe(gulp.dest(config.dist.assets))/" build-js.js
sed -n '15p' build-js.js
sed -i '' "s/var gulp = require('gulp');/var gulp = require('gulp');\\
var browserify = require('gulp-browserify');\\
var babel = require('gulp-babel');/" build-js.js
echo " 
DONE: 
  Slate now supports react components + proper require statements!
__________________________________________________________________"