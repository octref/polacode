# Changelog

### 0.2.2 | 2018-02-19

- Remove "Pasted content is invalid" check. Will do proper HTML validation in [#30](https://github.com/octref/polacode/issues/30).

### 0.2.1 | 2018-02-19

- Fix an issue where Polacode incorrectly reports "Pasted content is invalid".

### 0.2.0 | 2018-02-16

- Add warning when pasted content is not valid HTML copy-pasted from VS Code.
- Remove backdrop for snippet with light background.
- Find the line with smallest indentation and detract that indentation from all lines.
- Add `polacode.shoot` command that you can bind command to.
- Remember last used image save path.
- Wrap when code is longer than Polacode preview.
- Initialize with correct fontFamily.

### 0.1.2 | 2018-02-16

- Update readme with some tip and explanation.
- Make default filename `code.png`.

### 0.1.1 | 2018-02-15

- Fix a Windows path issue.
- Use correct background for snippet when pasting.

### 0.1.0 | 2018-02-15

- Initial release