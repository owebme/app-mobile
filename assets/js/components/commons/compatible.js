(function(app, $, $dom, device, _){

    app.define("compatible");

    app.compatible = {

        init: function(callback, options){
            if (device.isPhone){
                if (device.isAndroid && (!device.verOS || device.verOS && device.verOS < 4.4)){
                    this.render("android");
                }
                else if (device.isIOS && (!device.verOS || device.verOS && device.verOS < 7)){
                    this.render("ios");
                }
                else if (!device.isAndroid && !device.isIOS){
                    this.render("unknown");
                }
                else {
                    callback.call(this, options);
                }
            }
            else {
                callback.call(this, options);
            }
        },

        render: function(platform){
            var text;
            if (platform == "android"){
                text = "Версия вашего Android должна быть не ниже 4.4";
            }
            else if (platform == "ios"){
                text = "Версия вашей iOS должна быть не ниже 7.0";
            }
            else if (platform == "unknown"){
                text = "К сожалению ваше устройство не поддерживается. Android не ниже 4.4 или iOS 7.0";
            }
            $dom.body.append('<div class="incompatible-device"><div class="incompatible-device-wrapper"><svg class="incompatible-device-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path fill="#fff" d="M94.553,36.928c2.689-2.691,2.689-7.07,0-9.761L70.861,3.475c-1.303-1.304-3.036-2.021-4.879-2.021  c-1.844,0-3.577,0.718-4.881,2.022L4.256,60.321c-2.689,2.69-2.689,7.069,0,9.761l23.691,23.689  c0.152,0.152,0.312,0.295,0.475,0.432H14.688c-1.327,0-2.403,1.075-2.403,2.401c0,1.327,1.076,2.403,2.403,2.403h47.691  c1.326,0,2.401-1.076,2.401-2.403c0-1.326-1.075-2.401-2.401-2.401H37.234c0.162-0.137,0.322-0.278,0.473-0.431L94.553,36.928z   M42.95,81.643L16.387,55.078c-0.016-0.016-0.035-0.025-0.051-0.041l41.975-41.974c0.016,0.016,0.026,0.035,0.042,0.051  l26.562,26.563c0.016,0.016,0.035,0.026,0.051,0.042L42.991,81.693C42.976,81.678,42.966,81.658,42.95,81.643z M65.982,6.259  c0.559,0,1.087,0.219,1.482,0.614l23.69,23.692c0.816,0.817,0.816,2.148,0,2.966l-2.802,2.801c-0.016-0.017-0.026-0.036-0.043-0.052  L61.75,9.717c-0.017-0.016-0.035-0.026-0.051-0.042L64.5,6.873C64.896,6.477,65.422,6.259,65.982,6.259z M7.655,66.684  c-0.817-0.817-0.817-2.147,0-2.965l5.293-5.295c0.015,0.018,0.026,0.036,0.042,0.053L39.552,85.04  c0.016,0.017,0.035,0.026,0.052,0.041l-5.294,5.294c-0.792,0.794-2.171,0.791-2.964-0.001L7.655,66.684z"/><path fill="#fff" d="M82.905,28.24c0.344,0.345,0.905,0.345,1.249,0.001c0.344-0.345,0.342-0.905,0-1.248l-7.246-7.246  c-0.346-0.344-0.902-0.345-1.248,0c-0.344,0.344-0.344,0.903,0,1.249L82.905,28.24z"/><circle cx="72.533" cy="16.621" r="0.842"/><circle fill="#fff" cx="22.921" cy="75.107" r="2.759"/></svg><p class="incompatible-device-text">' + text + '</p></div></div>');
        }
    };

})(app, $$, app.$dom, app.device, app.utils);
