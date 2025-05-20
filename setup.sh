#! /bin/sh

docker build -t back ./src 
docker run -dit back