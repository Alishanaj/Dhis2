#!/bin/bash

docker run  -t --rm --env-file .env \
  --network dhis2-netspace dhis2-loader