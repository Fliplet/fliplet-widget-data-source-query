# Fliplet Data Source Query Provider

**Please note: this widget requires you to run the gulp watcher during development to compile the source files as you save.**

To develop widgets, please follow our [widget development guide](http://developers.fliplet.com).

---

Install dependencies:

```
$ npm install fliplet-cli -g
```

---


Clone and run for development:

```
$ git clone https://github.com/Fliplet/fliplet-widget-data-source-query.git
$ cd fliplet-widget-data-source-query

$ fliplet run
```

Installing gulp and its plugins:

```
$ npm install
```

**Running gulp to continuously build ES6 into JS**:

```
$ npm run watch
```

---

## How to call the provider

```js
var sampleData = {
  settings: {
    dataSourceLabel: 'Select a data source',
    modesDescription: 'How do you want your data to be plotted?',
    modes: [
      {
        label: 'Plot my data as it is',
        columns: [
          {
            key: 'bar',
            label: 'Select the value for Bar',
            type: 'single'
          },
          {
            key: 'foobar',
            label: 'Select the value for Foobar',
            type: 'single'
          }
        ]
      },
      {
        label: 'Summarise my data',
        filters: false,
        columns: [
          {
            key: 'foo',
            label: 'Select the value for Foo',
            type: 'single'
          }
        ]
      }
    ]
  }
};

Fliplet.Widget.open('com.fliplet.data-source-query', {
  data: sampleData
});
```