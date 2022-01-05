# How to do images

Images need to be 8bit greyscale to work with colour fill.

Use imagemagick to convert them

`magick convert [inPath] -depth 8 -colorspace gray [outPath]`

Content that will be coloured is white.

Content that will be transparent is black.