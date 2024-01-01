# Wellcome in xml-stream tool

This is tool for quick mutation inside large XLM files (2000 MB+).
It use streams and pipelines for best performance.
Tool could be more explored in case of performance however current results are satisfactory

### Areas to investigate:

1. Unit tests
1. Concurent processing,
1. Caching `opening_times` and return immediate result without parsing in to JSON again same values
1. Reduce string creation, reduce Buffer to string conversion
1. Fixing issues and limitations
1. Rewrite in rust ?

## Requrements to fire up project:

Node version 18+

1. `git clone https://github.com/kamilkodzi/xml-task.git`
1. `cd xml-task`
1. `npm install`
1. `npm start` to process example file data/feed.xml

## Assumptions:

1. Not taking time zones into account, all times converted to UTC
1. If <opening_times> node do not exist inside <offer>, then `is_active = false` is populated
1. If <opening_times> have `{"opening":"00:00","closing":"00:00"}`, then concidered as all day long active

## Limitation and issues:

Could be fixed in further iterations:

1. Whenever inside CDATA there will be some </offer> tag data will split incorrectly
2. Whenever inside any node there will be CDATA, that will contain <opening_times> data may be wrongly interpreted
