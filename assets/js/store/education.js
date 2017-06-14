$store.education = _.extend(new Baobab([
    {
        _id: "higher",
        parent: "0",
        title: {
            en: "Higher",
            ru: "Высшее"
        }
    },
    {
        _id: "bachelor",
        parent: "higher",
        title: {
            en: "Bachelor",
            ru: "Бакалавр"
        }
    },
    {
        _id: "master",
        parent: "higher",
        title: {
            en: "Master",
            ru: "Магистр"
        }
    },
    {
        _id: "candidate",
        parent: "higher",
        title: {
            en: "Candidate of Sciences",
            ru: "Кандидат наук"
        }
    },
    {
        _id: "doctor",
        parent: "higher",
        title: {
            en: "Doctor of Sciences",
            ru: "Доктор наук"
        }
    },
    {
        _id: "unfinished_higher",
        parent: "0",
        title: {
            en: "Incomplete higher",
            ru: "Неоконченное высшее"
        }
    },
    {
        _id: "special_secondary",
        parent: "0",
        title: {
            en: "Vocational secondary",
            ru: "Среднее специальное"
        }
    },
    {
        _id: "secondary",
        parent: "0",
        title: {
            en: "Secondary",
            ru: "Среднее"
        }
    }
    ]),
    {
        getItems: function(lang){
            return _.map($store.education.get(), function(item){
                return {
                    _id: item._id,
                    parent: item.parent,
                    title: item.title[lang || $store.resume.get("lang")]
                }
            });
        },
        getTitleById: function(id, lang){
            return $store.education.get({"_id": id}, "title", lang || $store.resume.get("lang"));
        }
    }
);
