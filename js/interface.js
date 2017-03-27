let app = new Vue({
  el: '#app',
  created() {
    /*let promise = */this.getDataSources();
    /*promise.then(() => {

    });*/
  },
  data: {
    widgetData: Fliplet.Widget.getData(),
    dataSources: null,
    selectedDataSource: null,
    selectedColumns: {},
    applyFilters: false,
    showFilters: false,
    operators: ['is exactly', 'contains', 'begins with', 'ends with', 'like'],
    filters: [],
    loadingError: null
  },
  computed: {
    result() {
      try {
        let columns = this.selectedColumns;
        let columnsCompact = [];
        for (let key in columns) {
          if (columns.hasOwnProperty(key)) {
            let val = columns[key];
            if (val && val.length) {
              if (typeof val === 'object') {
                for (let entry of val) {
                  columnsCompact.push(entry);
                }
              } else {
                columnsCompact.push(val);
              }
            }
          }
        }
        let filterDataArr = this.filters;
        let filters = [];
        for (let filterData of filterDataArr) {
          let filter;
          switch (filterData.operator) {
            case 'is exactly': {
              if (filterData.ignoreCase) {
                filter = {
                  $iLike: filterData.value.replace('%', '\\%')
                };
              } else {
                filter = {
                  $eq: filterData.value
                };
              }
              break;
            }
            case 'contains': {
              filter = {
                $iLike: `%${filterData.value.replace('%', '\\%')}%`
              };
              break;
            }
            case 'begins with': {
              filter = {
                $iLike: `${filterData.value.replace('%', '\\%')}%`
              };
              break;
            }
            case 'ends with': {
              filter = {
                $iLike: `%${filterData.value.replace('%', '\\%')}`
              };
              break;
            }
            case 'like': {
              filter = {
                $iLike: `%${filterData.value.slice(1, -1).replace('%', '\\%')}%`
              };
              break;
            }
          }
          filters.push({
            [filterData.column]: filter
          });
        }
        return {
          dataSourceId: this.selectedDataSource.id,
          filters: {
            $and: filters
          },
          columns: columns,
          columnsCompact: columnsCompact
        };
      } catch (e) {
        return `Unable to compute result: ${e}`;
      }
    }
  },
  watch: {
    filters(arr) {
      if (arr.length === 0 && this.showFilters && this.selectedDataSource) {
        this.addDefaultFilter();
      }
    },
    applyFilters(val) {
      if (val && this.filters.length === 0) {
        this.addDefaultFilter();
      }
      this.showFilters = val;
    }
  },
  methods: {
    getDataSources() {
      return Fliplet.DataSources.get()
          .then((data) => {
            this.loadingError = null;
            this.dataSources = data;
            console.log(`dataSources:`, data);
          })
          .catch((err) => {
            console.error(err);
            this.loadingError = err;
          });
    },
    addDefaultFilter() {
      this.filters.push({
        column: this.selectedDataSource.columns[0],
        operator: 'is exactly',
        value: '',
        ignoreCase: false
      });
    },
    updateSelectedColumns(key, val) {
      let newSelectedColumns = Object.assign({}, this.selectedColumns);
      if (val && val.length) {
        newSelectedColumns[key] = val;
      } else {
        delete newSelectedColumns[key];
      }
      this.selectedColumns = newSelectedColumns;
    },
    onDataSourceSelection() {
      if (this.selectedDataSource) {
        let bloodhound = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: this.selectedDataSource.columns.map((entry, index) => ({id: index, name: entry})),
          identify: (obj) => obj.id
        });
        bloodhound.initialize();
        this.typeaheadData = {
          typeaheadjs: {
            name: 'columns',
            displayKey: 'name',
            valueKey: 'name',
            source: bloodhound.ttAdapter()
          }
        };
        this.selectedColumns = {};
        this.filters = [];
      }
    }
  },
  components: {
    tagsinput: {
      template: `<input type="text" class="form-control" value="" :trigger-update="tagsinputData"/>`,
      props: ['tagsinputData', 'field', 'updateSelectedColumns'],
      mounted() {
        let $el = $(this.$el).change((event) => this.updateSelectedColumns(this.field.key, $el.tagsinput('items')));
        $el.tagsinput(this.tagsinputData);
      },
      updated() {
        let $el = $(this.$el);
        $el.tagsinput('removeAll');
        $el.tagsinput('destroy');
        $el.tagsinput(this.tagsinputData);
      }
    }
  }
});

// Fired when the external save button is clicked
Fliplet.Widget.onSaveRequest(() => {

  // Set the data
  app.widgetData.result = app.result;

  var resultData = JSON.parse(JSON.stringify(_.pick(app.widgetData, ['settings', 'result'])));

  console.log('Saving', resultData)

  // Send back the result
  Fliplet.Widget.save(resultData).then(() => {
    console.log('saved');
    // Tell the UI this widget has finished
    Fliplet.Widget.complete();
  });
});