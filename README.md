# Welcome to the xml-stream tool

This tool is for quick mutation inside large XML files (2000 MB+).
It uses streams and pipelines for the best performance.
The tool could be further explored in terms of performance, however, the current results are satisfactory.

### Areas to investigate:

1. Unit tests,
1. Concurrent processing,
1. Caching `opening_times` and returning immediate results without parsing into JSON again the same values,
1. Reducing string creation, reducing Buffer to string conversion,
1. Fixing issues and limitations,
1. Rewriting in Rust?

## Requirements to fire up the project:

Node version 18+

1. `git clone https://github.com/kamilkodzi/xml-task.git`
1. `cd xml-task`
1. `npm install`
1. `npm start` to process the example file data/feed.xml

## Assumptions:

1. Not taking time zones into account, all times converted to UTC,
1. If the <opening_times> node does not exist inside <offer>, then `is_active = false` is populated,
1. If <opening_times> have `{"opening":"00:00","closing":"00:00"}`, then it is considered as active all day long.

## Limitations and issues:

Could be fixed in further iterations:

1. Whenever there is some </offer> tag data inside CDATA, the data will split incorrectly,
2. Whenever there is CDATA inside any node that will contain <opening_times>, the data may be wrongly interpreted.
