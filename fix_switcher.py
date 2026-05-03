with open(r'src\modules\typing\ClassicTypingEngineModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Prev button
old1 = ('                          const newExam = passagesList[newIdx];\n'
        '                          setInternalPassage(newExam.passageId?.content || "No content found");\n'
        '                          // Also update settings if exam changed\n'
        '                          updateSettings({\n'
        '                            duration: internalDuration,\n'
        '                            language: newExam.language\n'
        '                          });')
new1 = ('                          const newItem = passagesList[newIdx];\n'
        "                          setInternalPassage(isBookPractice ? (newItem.content || '') : (newItem.passageId?.content || 'No content found'));\n"
        '                          updateSettings({ duration: internalDuration, language: newItem.language || config.language });')

if old1 in content:
    content = content.replace(old1, new1, 1)
    print('Prev OK')
else:
    print('Prev NOT FOUND')

# Dropdown onChange - find exact indentation
import re
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'newExam.passageId' in line and 'No content found' in line:
        print(f'Line {i+1}: {repr(line)}')

with open(r'src\modules\typing\ClassicTypingEngineModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
