# public-transport-sentiment-lists

This repository provides a list of phrases, which can be used to evaluate the text is a positive or negative statement. Its heavy inspired by AFINN lists but uses complete phrase instead of single words.

current provided lists are:

* [de_de](de_de-public-transport.txt)

If you what to use this list, you can use the the project [sentiment-custom-lists](https://github.com/oliverlorenz/sentiment-custom-lists) which is written in javascript

## Contribution

### rate tweets and add phrases
There is automatic process in the background which adds new relevant tweets to the assets. If you want to help, create a pull-request and rate the automatic added tweets and/or add phrases to the lists

#### Add a phrase

Format:
```
[REGULAR_EXPRESSION]<TAB>[RATING]
```
Example:
```
(zug|bus) fällt aus -1
```

run the tests:
```
npm install
npm test
```


### I know a twitter account which can provide test data
Please contact me. I can add the account to the process
