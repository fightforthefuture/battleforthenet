#!/bin/sh
for png in `find $1 -name "*.png"`;
do
  echo "crushing $png"  
  pngcrush -brute "$png" temp.png
  mv -f temp.png $png
done;