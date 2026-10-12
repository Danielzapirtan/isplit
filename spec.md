# iSplit Flask app

## Overview

iSplit is a Flask app for smart splitting PDF files by chapters.
It is made from classical programming, without AI at runtime.

## Getting text from PDF file

The app first reads text from each page of the PDF file.
We assume the PDF is searchable.

## Finding chapters' first page

```pseudocode
page.firstLine: Get()
page.reChaptHeadings: Match()
RULES::
Chapter.referenceOnly: Skip()
ambiguousChars: Solve()
