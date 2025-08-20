#!/usr/bin/env bash
# This script runs openapi-typescript for all API schemas used in the project.
set -e


# Define an array of API sources and their output files
apis=(
  "https://api.folksonomy.openfoodfacts.org/openapi.json src/schemas/folksonomy.ts"
  "https://prices.openfoodfacts.org/api/schema src/schemas/prices.ts"
  "https://raw.githubusercontent.com/openfoodfacts/robotoff/main/doc/references/api.yml src/schemas/robotoff.ts"
  "https://raw.githubusercontent.com/openfoodfacts/openfoodfacts-server/main/docs/api/ref/api.yaml src/schemas/server/v2.ts"
  "https://raw.githubusercontent.com/openfoodfacts/openfoodfacts-server/main/docs/api/ref/api-v3.yaml src/schemas/server/v3.ts"
  "https://nutripatrol.openfoodfacts.org/api/openapi.json src/schemas/nutripatrol.ts"
  "https://search.openfoodfacts.org/openapi.json src/schemas/search.ts"
  "https://facets-kp.openfoodfacts.org/openapi.json src/schemas/facets-kp.ts"
)

# Iterate over the array and run openapi-typescript for each
for entry in "${apis[@]}"; do
  set -- $entry
  url=$1
  output=$2
  echo "Generating $output from $url"
  openapi-typescript "$url" --output "$output"
done
