#!/bin/bash

confirm() {
  cat > file <<EOF
Preset 1:
Monoboot setup: 
sda1, sda2
Additional packages: gnome

Preset 2:
Monoboot setup:
vda1, vda2
Additional packages: gnome

More presets to come.
Choose a preset (0 to cancel, 1, 2)
EOF
read choicetwo
if [["$choice" -eq 0]]; then
    main
elif [["$choice" -eq 1]]; then
    curl -fsSL https://github.com/Typhoonz0/autoarch/raw/refs/heads/main/autoarch.sh -o autoarch.sh
    sh autoarch.sh
else
    curl -fsSL https://github.com/Typhoonz0/autoarch/raw/refs/heads/main/autoarch.sh -o autoarch.sh
    sh autoarch.sh
fi
}

main() {
echo "Press ENTER to continue to the simple script, or type 'preset' without quotes to download a preset installation (No dualboot)."
read choice

if [["$choice" == "preset"]]; then
    confirm
else
  curl -fsSL https://github.com/Typhoonz0/autoarch/raw/refs/heads/main/autoarch.sh -o autoarch.sh
  sh autoarch.sh
fi
}

main


