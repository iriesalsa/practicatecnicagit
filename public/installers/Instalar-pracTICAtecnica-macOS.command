#!/bin/bash
APP_URL="https://practicatecnica.com"
cat > "$HOME/Desktop/pracTICAtecnica.webloc" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict><key>URL</key><string>${APP_URL}</string></dict></plist>
EOF
open "$APP_URL"