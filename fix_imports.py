import os
import re

count = 0
for root, dirs, files in os.walk('src'):
    if 'supabase/functions' in root:
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace package@version with package in imports
            # e.g. "lucide-react@0.487.0" -> "lucide-react", "@radix-ui/react-checkbox@1.1.4" -> "@radix-ui/react-checkbox"
            new_content = re.sub(r'(from\s+[\'"])(@?[a-zA-Z0-9_.-]+(?:/[a-zA-Z0-9_.-]+)*)@[0-9][0-9A-Za-z_.-]*([\'"])', r'\g<1>\g<2>\g<3>', content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Fixed {path}")
                count += 1

print(f"Fixed {count} files")
