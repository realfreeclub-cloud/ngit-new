with open(r'src\modules\typing\ClassicTypingEngineModule.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix dropdown onChange block (lines 385-390 = index 384-389)
lines[384] = '                        const newItem = passagesList[newIdx];\r\n'
lines[385] = "                        setInternalPassage(isBookPractice ? (newItem.content || '') : (newItem.passageId?.content || 'No content found'));\r\n"
lines[386] = '                        updateSettings({ duration: internalDuration, language: newItem.language || config.language });\r\n'
# Remove old lines 387-390 (updateSettings block)
del lines[387]  # language: newExam.language
del lines[387]  # });
del lines[387]  # blank }

# Fix option label (was line 398, now shifted)
for i, line in enumerate(lines):
    if "p.bookId?.name" in line and "Exercise:" in line:
        lines[i] = "                            {isBookPractice ? `Ch. ${i_}/${passagesList.length} - ${p.title?.substring(0,40)}` : `Exercise: ${i_+1}/${passagesList.length} - ${p.title?.substring(0,30)}`}\r\n"
        # Actually the JSX uses {i} as variable name not python i
        lines[i] = "                            {isBookPractice ? `Ch. ${(i_) + 1}/${passagesList.length} - ${p.title?.substring(0, 40)}` : `Exercise: ${(i_) + 1}/${passagesList.length} - ${p.title?.substring(0, 30)}`}\r\n"
        break

# Fix next button block - find lines with newExam in next button area
for i, line in enumerate(lines):
    if i > 400 and 'const newExam = passagesList[newIdx]' in line:
        lines[i] = '                           const newItem = passagesList[newIdx];\r\n'
        lines[i+1] = "                           setInternalPassage(isBookPractice ? (newItem.content || '') : (newItem.passageId?.content || 'No content found'));\r\n"
        lines[i+2] = '                           updateSettings({ duration: internalDuration, language: newItem.language || config.language });\r\n'
        del lines[i+3]  # language: ...
        del lines[i+3]  # });
        break

with open(r'src\modules\typing\ClassicTypingEngineModule.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done')
