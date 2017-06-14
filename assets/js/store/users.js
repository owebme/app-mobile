$store.users = _.extend(new Baobab([]),
    {
        dataTable: function($, self){
        return {
            title: "users",
            order: [[ 12, "desc" ]],
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
                    render: function(value, type, row){
                        return '<span class="dataTable__checkbox"></span>';
                    }
                },
                {
                    targets: 1,
                    data: 'commons.photo',
                    className: "col-photo",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        return self.props.get.photo(value, row);
                    },
                },
                {
                    targets: 2,
                    data: 'name',
                    defaultContent: "",
                    className: "col-title",
                    render: function(value, type, row){
                        return (value || "") + " " + (row.surname || "");
                    }
                },
                {
                    targets: 3,
                    data: "metrika",
                    className: "col-fidelity",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        return self.props.get.fidelity(value);
                    }
                },
                {
                    targets: 4,
                    data: "metrika",
                    className: "col-activity",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        return self.props.get.activity(value, row);
                    }
                },
                {
                    targets: 5,
                    data: "metrika",
                    defaultContent: "",
                    className: "col-welcome",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        return self.props.get.welcome(value);
                    }
                },
                {
                    targets: 6,
                    data: "resumes",
                    defaultContent: "&mdash;",
                    className: "col-resume text-center",
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 7,
                    data: "visits",
                    className: "col-visits text-center",
                    orderable: false,
                    searchable: false
                },
                {
                    targets: 8,
                    data: 'init.device',
                    className: "col-device",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        return '<div class="dataTable__device" data-device="' + value + '"></div>';
                    }
                },
                {
                    targets: 9,
                    data: 'plan',
                    className: "col-plan",
                    render: function(value, type, row){
                        if (value == "premium"){
                            return '<span class="text-capitalize c-blue">' + value + '</span>';
                        }
                        else {
                            return '<span class="text-capitalize c-green">' + value + '</span>';
                        }
                    }
                },
                {
                    targets: 10,
                    data: 'balance',
                    className: "col-balance",
                    orderable: false,
                    searchable: false,
                    render: function(value, type, row){
                        return value + ' ₽';
                    }
                },
                {
                    targets: 11,
                    data: 'init.location.city',
                    defaultContent: "&mdash;",
                    className: "col-city text-truncate",
                    orderable: false
                },
                {
                    targets: 12,
                    data: 'create',
                    className: "col-date",
                    searchable: false,
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
