$store.samples = _.extend(new Baobab([]),
    {
        getItemsByStatus: function(status){
            return _.where($store.samples.get(), {"_status": status});
        },
        getItemsByPlan: function(plan){
            return _.where($store.samples.get(), {"plan": plan});
        },
        dataTable: function($, self){
        return {
            title: "samples",
            order: [[ 7, "desc" ]],
            colVis: {
                exclude: [ 0, 1 ]
            },
            columnDefs: [
                {
                    targets: 0,
                    data: null,
                    className: "col-check",
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row){
                        return '<span class="dataTable__checkbox"></span>';
                    }
                },
                {
                    targets: 1,
                    data: 'commons.photo',
                    className: "col-photo",
                    orderable: false,
                    searchable: false,
                    // visible: false,
                    render: function(value, type, row){
                        if (value && value.length){
                            return '<div class="dataTable__photo" style="background-image:url('+ value +')"></div>';
                        }
                        else {
                            return value;
                        }
                    },
                },
                {
                    targets: 2,
                    data: 'post',
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
                    targets: 3,
                    data: 'plan',
                    defaultContent: "",
                    className: "col-plan",
                    render: function(value, type, row){
                        if (value === "premium"){
                            return '<div class="dataTable__badge bg-blue">PREMIUM</div>';
                        }
                    }
                },
                {
                    targets: 4,
                    data: 'education.level',
                    defaultContent: "&mdash;",
                    className: "col-education",
                    render: function(value, type, row){
                        if (value){
                            return $store.education.getTitleById(String(value), "ru");
                        }
                    }
                },
                {
                    targets: 5,
                    data: 'salary.amount',
                    defaultContent: "",
                    className: "col-salary",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        if (value){
                            return value + " RUR";
                        }
                    }
                },
                {
                    targets: 6,
                    data: 'commons.contacts.city.name',
                    className: "col-city",
                    orderable: false,
                    searchable: true
                },
                {
                    targets: 7,
                    data: 'update',
                    className: "col-date",
                    render: function(value, type, row){
                        if (type === "display"){
                            return moment(value).format('D/MM');
                        }
                        else {
                            return moment(value).unix();
                        }
                    }
                }
            ]
        }}
    }
);
