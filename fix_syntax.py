with open(r'src\modules\typing\ClassicTypingEngineModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("`Ch. ${(i_) + 1}/${passagesList.length} - ${p.title?.substring(0, 40)}` : `Exercise: ${(i_) + 1}/${passagesList.length} - ${p.title?.substring(0, 30)}`", "`Ch. ${i + 1}/${passagesList.length} - ${p.title?.substring(0, 40)}` : `Exercise: ${i + 1}/${passagesList.length} - ${p.title?.substring(0, 30)}`")

content = content.replace("                           updateSettings({ duration: internalDuration, language: newItem.language || config.language });\n                          });\n                       }", "                           updateSettings({ duration: internalDuration, language: newItem.language || config.language });\n                       }")

with open(r'src\modules\typing\ClassicTypingEngineModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax")
