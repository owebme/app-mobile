$store.samples.status = _.extend(new Baobab([
    {
        _id: "all",
        title: "Новый"
    },
    {
        _id: "preready",
        title: "Обработанный"
    },
    {
        _id: "ready",
        title: "Готовый"
    },
    {
        _id: "public",
        title: "Опубликованный"
    }
]), {
    getTitleById: function(id){
        return $store.samples.status.get({'_id': id}, 'title');
    }
});
