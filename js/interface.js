// Read the input data
var data = Fliplet.Widget.getData();

// Fired when the external save button is clicked
Fliplet.Widget.onSaveRequest(function () {

  // Set the data
  data.result = {
    foo: true
  };

  // Send back the result
  Fliplet.Widget.save(data).then(function () {
    // Tell the UI this widget has finished
    Fliplet.Widget.complete();
  });
});

// Sample to read data sources
Fliplet.DataSources.get().then(console.log);