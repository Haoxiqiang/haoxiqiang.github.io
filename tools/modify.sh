#!/bin/bash

# Loop through all files in the current directory
for file in *; do
  # Check if the file name matches the pattern YYYY-MM-DD
  if [[ $file =~ ([0-9]{4})-([0-9]{2})-([0-9]{2}) ]]; then
    # Extract the date components
    year=${BASH_REMATCH[1]}
    month=${BASH_REMATCH[2]}
    day=${BASH_REMATCH[3]}
    
    # Construct the date string in the format YYYYMMDD
    date_str="${year}${month}${day}"
    
    # Use the touch command to modify the file modification time
    touch -t "${date_str}0000" "$file"
    
    echo "Modified $file modification time to ${year}-${month}-${day} 00:00:00"
  fi
done