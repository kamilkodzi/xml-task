# Wellcome in xml-stream tool

## Requrements to fire up project:

TBD

## Assumptions

1. Not taking time zones into account, all times converted to UTC
1. If <opening_times> node do not exist inside <offer> then `is_active = false` is populated

## Limitation:

1. Whenever inside CDATA there will be some </offer> tag data will split incorrectly
2. Whenever inside any node there will be CDATA, that will contain <opening_times> data may be wrongly interpreted
