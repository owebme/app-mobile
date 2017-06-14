$store.samplesPremium = _.extend(new Baobab([]),
    {
        dataTable: function($, self){
        return {
            title: "samplesPremium",
            order: [[ 0, "asc" ]],
            colVis: {
                exclude: [ 0, 1, 2, 3 ]
            },
            columnDefs: [
                {
                    targets: 0,
                    data: "pos",
                    orderable: true,
                    searchable: false,
                    visible: false
                },
                {
                    targets: 1,
                    data: null,
                    className: "col-sort",
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row){
                        return '<span class="dataTable__sort__handler"><span></span></span>';
                    }
                },
                {
                    targets: 2,
                    data: null,
                    className: "col-check",
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row){
                        return '<span class="dataTable__checkbox"></span>';
                    }
                },
                {
                    targets: 3,
                    data: "photo.small",
                    className: "col-photo",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        if (value){
                            return '<div class="dataTable__photo" style="background-image:url(http://192.168.1.64:3000/' + value + ')"></div>';
                        }
                        else {
                            return '<div class="dataTable__photo__blank"></div>';
                        }
                    },
                },
                {
                    targets: 4,
                    data: 'title',
                    orderable: false,
                    className: "col-title",
                    render: function(value, type, row){
                        if (value && value.length){
                            return '<span class="text-truncate">'+ value +'</span>';
                        }
                        else {
                            return value;
                        }
                    }
                },
                {
                    targets: 5,
                    data: 'post',
                    orderable: false,
                    className: "col-post",
                    render: function(value, type, row){
                        if (value && value.length){
                            return '<span class="text-truncate">'+ value +'</span>';
                        }
                        else {
                            return value;
                        }
                    }
                },
                {
                    targets: 6,
                    data: 'color',
                    orderable: false,
                    searchable: false,
                    className: "col-color",
                    render: function(value, type, row){
                        return '<span class="display-inlineBlock w16 h16 borderRadius-circle" style="background-color:' + value + '; margin-top:6px"></span>';
                    }
                },
                {
                    targets: 7,
                    data: "alias",
                    defaultContent: "",
                    className: "col-link",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        if (row.sampleId){
                            return '<span class="c-blue">/' + value + '</span>';
                        }
                    }
                },
                {
                    targets: 8,
                    data: null,
                    defaultContent: "&mdash;",
                    className: "col-education",
                    orderable: false,
                    render: function(value, type, row){
                        if (row.sampleId){
                            return $store.education.getTitleById($store.samples.get({"_id": row.sampleId}, "education", "level"), "ru");
                        }
                    }
                },
                {
                    targets: 9,
                    data: null,
                    defaultContent: "",
                    className: "col-salary",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        if (row.sampleId){
                            return $store.samples.get({"_id": row.sampleId}, "salary", "amount") + " RUR";
                        }
                    }
                },
                {
                    targets: 10,
                    data: null,
                    defaultContent: "",
                    className: "col-city",
                    orderable: false,
                    searchable: true,
                    render: function(value, type, row){
                        if (row.sampleId){
                            return $store.samples.get({"_id": row.sampleId}, "commons", "contacts", "city", "name");
                        }
                    }
                }
            ]
        }}
    }
);
