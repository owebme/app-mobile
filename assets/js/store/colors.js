$store.colors = _.extend(new Baobab([
    {
        _id: "#0084ff",
        title: "blueLight",
        titles: {
            en: "Modern",
            ru: "Модный"
        }
    },
    {
        _id: "#265cdc",
        title: "blue",
        titles: {
            en: "Blue",
            ru: "Cиний"
        }
    },
    {
        _id: "#74b027",
        title: "green",
        titles: {
            en: "Green",
            ru: "Зеленый"
        }
    },
    {
        _id: "#0bb5b7",
        title: "emerald",
        titles: {
            en: "Emerald",
            ru: "Изумрудный"
        }
    },
    {
        _id: "#ff7272",
        title: "pink",
        titles: {
            en: "Pink",
            ru: "Гламурный"
        }
    },
    {
        _id: "#d93663",
        title: "red",
        titles: {
            en: "Crimson",
            ru: "Малиновый"
        }
    },
    {
        _id: "#c1a16b",
        title: "brown",
        titles: {
            en: "Business",
            ru: "Деловой"
        }
    },
    {
        _id: "#ea7f07",
        title: "orange",
        titles: {
            en: "Orange",
            ru: "Оранжевый"
        }
    },
    {
        _id: "#ab81cd",
        title: "violetLight",
        titles: {
            en: "Violet light",
            ru: "Лиловый"
        }
    },
    {
        _id: "#5856d6",
        title: "violet",
        titles: {
            en: "Violet",
            ru: "Фиолетовый"
        }
    }
    ]),
    {
        getItems: function(lang){
            return _.map($store.colors.get(), function(item){
                return {
                    _id: item._id,
                    title: item.titles[lang || "ru"]
                }
            });
        },
        getTitleById: function(id){
            return _.findWhere($store.colors.get(), {"_id": id}).title;
        }
    }
);
