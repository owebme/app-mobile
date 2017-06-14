(function(app, $, $dom, EV, _){

    app.define("router");

    app.router = {

        base: "#/",

        url: null,

        section: null,

        init: function(){

            riot.route = window.route;

            riot.route('/', function(){
                Router.routes.users();
            });

            riot.route('/samples/*', function(status){
                Router.routes.samples(status);
            });

            riot.route('/jp-test', function(){
                Router.routes.jptest();
            });

            riot.route('/jp-test/*', function(section){
                Router.routes.jptest(section);
            });

            riot.route('/blog', function(){
                Router.routes.blog();
            });

            riot.route('/orders', function(){
                Router.routes.orders();
            });

            riot.route('/payments', function(){
                Router.routes.payments();
            });

            $dom.window.on('hashchange', function(e){
                Router.setUrl();
            });

            riot.route.base(this.base);
            riot.route.start(true);
        },

        routes: {
            init: function(){
                $Nav = new Baobab([
                    {
                        url: "/",
                        section: "users",
                        title: "Пользователи",
                        items: [
                            {
                                url: "/",
                                title: "Все"
                            },
                            {
                                url: "/users/active",
                                title: "Активные"
                            },
                            {
                                url: "/users/passive",
                                title: "Пасивные"
                            }
                        ]
                    },
                    {
                        url: "/samples/all",
                        section: "samples",
                        title: "Образцы резюме",
                        items: [
                            {
                                url: "/samples/all",
                                title: "Все резюме"
                            },
                            {
                                url: "/samples/preready",
                                title: "Обработанные"
                            },
                            {
                                url: "/samples/ready",
                                title: "Готовые"
                            },
                            {
                                url: "/samples/public",
                                title: "Опубликованные"
                            },
                            {
                                url: "/samples/premium",
                                title: "Премиум"
                            }
                        ]
                    },
                    {
                        url: "/jp-test/stat",
                        section: "jp-test",
                        title: "JP-тест 2.0",
                        items: [
                            {
                                url: "/jp-test",
                                title: "Контент"
                            },
                            {
                                url: "/jp-test/stat",
                                title: "Статистика"
                            }
                        ]
                    },
                    {
                        url: "/jp-test/blog",
                        section: "blog",
                        title: "Блог"
                    },
                    {
                        url: "/orders",
                        section: "orders",
                        title: "Заказы"
                    },
                    {
                        url: "/support",
                        section: "support",
                        title: "Поддержка"
                    },
                    {
                        url: "/payments",
                        section: "payments",
                        title: "Оплаты"
                    }
                ]);
            },
            users: function(){
                Router.section = "users";
                Router.mount('section-users');
            },
            samples: function(status){
                Router.section = "samples";
                if (status === "premium"){
                    Router.mount('section-samples-premium');
                }
                else {
                    Router.mount('section-samples', {
                        status: status
                    });
                }
            },
            jptest: function(section){
                Router.section = "jp-test";
                if (section){
                    Router.mount('section-jptest' + '-' + section);
                }
                else {
                    Router.mount('section-jptest');
                }
            },
            blog: function(){
                Router.section = "blog";
                Router.mount('section-blog');
            },
            orders: function(){
                Router.section = "orders";
                Router.mount('section-orders');
            },
            payments: function(){
                Router.section = "payments";
                Router.mount('section-payments');
            }
        },

        setUrl: function(){
            Router.url = Router.getUrl();
        },

        getUrl: function(){
            return location.hash && location.hash.match(/#(.+)/)[1] || "/";
        },

        nav: function(url){
            riot.route(url);
        },

        mount: function(tag, options){
            if (Router.url){
                $LoaderAjax.show();
                $Loader.show();
                //$Loader.show().then(function(){
                    var section = riot.mount("section-content", tag, options)[0];
                    section.one("updated", function(){
                        $Sections.header.section.update();
                        $LoaderAjax.hide();
                        $Loader.hide();
                    });
                    section.update();
                //});
            }
            else {
                Router.setUrl();
                var section = riot.mount("section-content", tag, options)[0];
                section.one("updated", function(){
                    $Sections.header.section.update();
                    $afterlag.run(function(){
                        app.$dom.body
                        .removeClass("appLoading")
                        .addClass("isLoading");
                    }, {
                        timeout: 1000
                    });
                });
                section.update();
            }
        }
    };

    var Router = app.router;

    Router.routes.init();

    $Router = app.router;

})(app, $$, app.$dom, app.events, app.utils);
