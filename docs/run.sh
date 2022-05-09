#!/bin/bash

sudo bundle update

sudo bundle exec jekyll clean

sudo bundle exec jekyll serve --livereload
