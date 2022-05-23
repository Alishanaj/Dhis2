#!/bin/bash

docker run  -t --rm --env-file /home/akdndhrc/muzzammil/projects/Dhis2/.env \
  --network dhis-apis_dhis-netspace dhis2-loader:latest