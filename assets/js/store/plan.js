$store.samples.plan = _.extend(new Baobab([
    {
        _id: "free",
        title: "Free"
    },
    {
        _id: "premium",
        title: "Premium"
    }
]), {
    getTitleById: function(id){
        return $store.samples.plan.get({'_id': id}, 'title');
    }
});
