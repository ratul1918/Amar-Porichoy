#!/usr/bin/env python3
import subprocess
import os

os.chdir("/Users/rafiurrahman/Desktop/Porichoy Digital Identity Platform")

# List of one-word commit messages (163 messages)
messages = [
    "Initial", "Update", "Remove", "Add", "Fix", "Improve", "Refactor", "Optimize", "Enhance", "Complete",
    "Finalize", "Setup", "Configure", "Implement", "Clean", "Restore", "Rebuild", "Restructure", "Modernize", "Simplify",
    "Standardize", "Migrate", "Transform", "Polish", "Stabilize", "Integrate", "Consolidate", "Synthesize", "Amplify", "Accelerate",
    "Beautify", "Centralize", "Clarify", "Debugged", "Evaluated", "Formatted", "Generated", "Harmonized", "Itemized", "Justified",
    "Configured", "Liquidated", "Maintained", "Normalized", "Optimized", "Paginated", "Qualified", "Rationalized", "Streamlined", "Trimmed",
    "Unified", "Verified", "Weighed", "Xrayed", "Yielded", "Zeroed", "Addressed", "Balanced", "Categorized", "Documented",
    "Elaborated", "Fostered", "Generated", "Harmonized", "Illustrated", "Justified", "Kindled", "Launched", "Manufactured", "Numbered",
    "Ordered", "Processed", "Questioned", "Refined", "Sorted", "Targeted", "Unfolded", "Validated", "Witnessed", "Examined",
    "Yielded", "Zoned", "Agile", "Brilliant", "Clever", "Daring", "Excellent", "Fabulous", "Great", "Heroic",
    "Incredible", "Jolly", "Keen", "Lively", "Magnificent", "Noble", "Outstanding", "Perfect", "Quiet", "Radiant",
    "Stellar", "Tremendous", "Unique", "Vibrant", "Wonderful", "Xtreme", "Youthful", "Zesty", "Adjusted", "Brightened",
    "Corrected", "Deepened", "Elevated", "Fortified", "Governed", "Heightened", "Illuminated", "Joined", "Keyed", "Linked",
    "Mastered", "Nested", "Opened", "Paired", "Queued", "Reduced", "Staged", "Tagged", "Unified", "Vested",
    "Worked", "Examined", "Yielded", "Zapped", "Aligned", "Bound", "Crosslinked", "Distributed", "Encoded", "Fused",
    "Gated", "Hosted", "Indexed", "Jammed", "Kinged", "Logged", "Mirrored", "Noted", "Organized", "Pinned",
    "Queued", "Routed", "Stored", "Tagged", "Updated", "Validated", "Wrapped", "Xtended", "Yielded", "Zoned"
]

counter = 0

# Get modified files
result = subprocess.run(['git', 'diff', '--name-only', '--diff-filter=M'], capture_output=True, text=True)
modified_files = [f for f in result.stdout.strip().split('\n') if f]

print(f"Modified files: {len(modified_files)}")
for file in modified_files:
    subprocess.run(['git', 'add', file])
    msg = messages[counter % len(messages)]
    subprocess.run(['git', 'commit', '-m', msg])
    print(f"Committed (modified): {file} - '{msg}'")
    counter += 1

# Get deleted files
result = subprocess.run(['git', 'diff', '--name-only', '--diff-filter=D'], capture_output=True, text=True)
deleted_files = [f for f in result.stdout.strip().split('\n') if f]

print(f"Deleted files: {len(deleted_files)}")
for file in deleted_files:
    subprocess.run(['git', 'rm', file])
    msg = messages[counter % len(messages)]
    subprocess.run(['git', 'commit', '-m', msg])
    print(f"Committed (deleted): {file} - '{msg}'")
    counter += 1

# Get untracked files
result = subprocess.run(['git', 'ls-files', '--others', '--exclude-standard'], capture_output=True, text=True)
untracked_files = [f for f in result.stdout.strip().split('\n') if f]

print(f"Untracked files: {len(untracked_files)}")
for file in untracked_files:
    subprocess.run(['git', 'add', file])
    msg = messages[counter % len(messages)]
    subprocess.run(['git', 'commit', '-m', msg])
    print(f"Committed (new): {file} - '{msg}'")
    counter += 1

print(f"\nTotal commits created: {counter}")
