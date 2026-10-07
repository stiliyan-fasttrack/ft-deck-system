#!/bin/bash
# probe_powerpoint.sh deck.pptx — opens the file in PowerPoint and reports whether the "Repair" dialog appeared (the one
# check LibreOffice + XSD validation cannot do). Clicks Cancel and closes afterwards. Needs Accessibility permission for
# System Events. Found 2026-10-07: per-category chart build animations (graphicEl targets) trigger Repair on PowerPoint for Mac.
f="$1"; osascript -e 'tell application "Microsoft PowerPoint" to close every presentation saving no' >/dev/null 2>&1; sleep 1
open -a "Microsoft PowerPoint" "$f"; sleep 8
r=$(osascript -e 'tell application "System Events" to tell process "Microsoft PowerPoint" to return (exists button "Repair" of window 1)' 2>&1)
echo "$(basename "$f"): repair-dialog=$r"
if [ "$r" = "true" ]; then osascript -e 'tell application "System Events" to tell process "Microsoft PowerPoint" to click button "Cancel" of window 1' >/dev/null 2>&1; sleep 1; fi
osascript -e 'tell application "Microsoft PowerPoint" to close every presentation saving no' >/dev/null 2>&1
