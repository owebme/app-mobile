$store.jptestStat = _.extend(new Baobab([]),
    {
        dataTable: function($, self){
        return {
            title: "jptestStat",
            order: [[ 4, "desc" ]],
            colVis: {
                exclude: [ 0 ]
            },
            columnDefs: [
                {
                    targets: 0,
                    data: 'photo',
                    defaultContent: '<div class="dataTable__photo__blank centered"></div>',
                    className: "col-photo",
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 1,
                    data: 'score',
                    className: "col-score",
                    searchable: false,
                    render: function(value, type, row){
                        if (type === "sort"){
                            return value;
                        }
                        else {
                            return '<span class="dataTable__stars">'+ _.map(_.range(value), function(){return '&starf;'}).join("") +'</span>';
                        }
                    }
                },
                {
                    targets: 2,
                    data: 'device',
                    defaultContent: "&mdash;",
                    className: "col-device",
                    render: function(value, type, row){
                        return '<div class="dataTable__device" data-device="' + value + '"></div>';
                    }
                },
                {
                    targets: 3,
                    data: 'site',
                    defaultContent: "",
                    className: "col-site",
                    searchable: false,
                    render: function(value, type, row){
                        if (value){
                            return '<span class="dataTable__checkbox" data-checked="true"></span>';
                        }
                    }
                },
                {
                    targets: 4,
                    data: 'create',
                    defaultContent: "",
                    className: "col-date",
                    searchable: false,
                    render: function(data, type, row){
                        if (type === "display"){
                            return moment(data).format('D/MM');
                        }
                        else {
                            return moment(data).unix();
                        }
                    }
                }
            ]
        }}
    }
);
