$store.month = _.extend(new Baobab([
    {
        _id: "1",
        title: {
            en: "January",
            ru: "Январь"
        }
    },
    {
        _id: "2",
        title: {
            en: "February",
            ru: "Февраль"
        }
    },
    {
        _id: "3",
        title: {
            en: "March",
            ru: "Март"
        }
    },
    {
        _id: "4",
        title: {
            en: "April",
            ru: "Апрель"
        }
    },
    {
        _id: "5",
        title: {
            en: "May",
            ru: "Май"
        }
    },
    {
        _id: "6",
        title: {
            en: "June",
            ru: "Июнь"
        }
    },
    {
        _id: "7",
        title: {
            en: "July",
            ru: "Июль"
        }
    },
    {
        _id: "8",
        title: {
            en: "August",
            ru: "Август"
        }
    },
    {
        _id: "9",
        title: {
            en: "September",
            ru: "Сентябрь"
        }
    },
    {
        _id: "10",
        title: {
            en: "October",
            ru: "Октябрь"
        }
    },
    {
        _id: "11",
        title: {
            en: "November",
            ru: "Ноябрь"
        }
    },
    {
        _id: "12",
        title: {
            en: "December",
            ru: "Декабрь"
        }
    }
    ]),
    {
        getItems: function(lang){
            return _.map($store.month.get(), function(item){
                return {
                    _id: item._id,
                    title: item.title[lang || "ru"]
                }
            });
        },
        getTitleById: function(id, lang){
            return $store.month.get({"_id": id}, "title", lang || $store.resume.get("lang"));
        }
    }
);
