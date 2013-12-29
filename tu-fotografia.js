
$(function(){
   function launchFullScreen(element) {
     if(element.requestFullscreen) {
       element.requestFullscreen();
     } else if(element.mozRequestFullScreen) {
       element.mozRequestFullScreen();
     } else if(element.webkitRequestFullscreen) {
       element.webkitRequestFullscreen();
     } else if(element.msRequestFullscreen) {
       element.msRequestFullscreen();
     }
   }

   $('.log-in').on('click',function(){
       launchFullScreen(document.documentElement);
   });

    var cliet_id;
    var host    = window.location.href;
    var $musica = $('.musica');
    if(host !== "http://192.168.1.14:8000/"){
        client_id = '7c8f23d19cce4815b86d76100c97bf56';
    }else{
        client_id = '07fb6ffc314a4c5cbb00f55a6ec3a0aa';
    }
    var url_login = 'https://instagram.com/oauth/authorize/?client_id='+client_id+'&redirect_uri='+host+'&response_type=token';
    $('.log-in, audio').attr('href',url_login).css('top',$(window).height()/2 - 50);
    if(window.location.href.split('#')[1] !== undefined){
        var access_token = (window.location.href.split('#')[1]).split('=')[1];
        var access_parameters = {access_token:access_token};
        // $('.log-in').hide();
        cargarUsuario();

    }else{
        $('.log-in').removeClass('hidden');
        $('audio').hide();
    }
    var user_id;
    var fotos = [];
    var id;
    var max_timestamp;
    var app;
    var slider;
    function cargarUsuario(){
        // var token = (window.location.href.split('#')[1]).split('=')[1];
        // $.getJSON('https://api.instagram.com/v1/users/search?q=pauveelez&callback=?',access_parameters,function(data){
        $.getJSON('https://api.instagram.com/v1/users/self?callback=?',access_parameters,function(data){
            // var datos = data.data[0];
            var datos = data.data;
            // id = datos.id;
            id = "276630535"
            // console.log(datos)
            // console.log(datos);
            // if(datos.username == "pauveelez"){
                app = {
                    mp3 : 'tu-fotografia.mp3',
                    letra : true,
                    allImage : false,
                    time : 5000,
                };
            // }else{
            //     app = {
            //         mp3 : 'midnight-city.mp3',
            //         letra : false,
            //         allImage : true,
            //         time : 1000,
            //     };
            // }
            $('.profile').removeClass('hidden');
            $('.avatar').attr('src',datos.profile_picture);
            $('.username').text(datos.full_name);
            $musica.attr('src',app.mp3);
            if($(window).width() <= 1280){
                $('.musica').attr('controls','controls');
            }else{
                $('.musica')[0].play();
            }
        });

    }
    function cargarImagenes(){
        if(max_timestamp !== undefined){
            $.getJSON('https://api.instagram.com/v1/users/'+id+'/media/recent?count=100&max_timestamp='+max_timestamp+'&callback=?',access_parameters,function(data){
                afteRequest(data);

            });
        }else{
            $.getJSON('https://api.instagram.com/v1/users/'+id+'/media/recent?count=100&callback=?',access_parameters,function(data){
                afteRequest(data);
            });
        }
        
        function afteRequest(data){
            $.each(data.data,function(i, item){
                if(item.type === 'image'){
                    if(app.allImage){
                        fotos.push(item);
                    }else{
                        if(item.likes.count >= 11){
                            fotos.push(item);
                        }
                    }
                }

            });
            if(max_timestamp === undefined){
                transition(fotos);
            }
            max_timestamp = fotos[fotos.length-1].caption.created_time;
            fotos.pop();

        }
    }
    function transition(){
        // console.log(fotos);
        // var max = 19;
        var cont = 1;
        $('.fotos').append('<img src="'+fotos[0].images.standard_resolution.url+'" class="foto" style="left:10px; top 50px;">');

        slider = setInterval(function(){
            var imagen   = fotos[cont].images.standard_resolution.url;
            var left;
            if($(window).width() <= 768){
                left     = Math.floor((Math.random()*$(window).width())+1);
            }else{
                left     = Math.floor((Math.random()*($(window).width()/1.5))+1);
            }
            var top      = Math.floor((Math.random()*300)+1);
            var rotacion = Math.floor((Math.random()*3));
            var likes;
            if(app.allImage){
                likes = (fotos[cont].likes.count)*40;
            }else{
                likes = (fotos[cont].likes.count)*20;
            }
            var $img     = '<img class="foto" src="'+imagen+'" style="left:'+left+'px; top:'+top+'px; height:'+likes+'px";width:'+likes+'px;">';
            $('.fotos').append($img);
            var rotateCSS;
            if(cont % 2 === 0 ){
               rotateCSS = {
                   'opacity':1,
                   '-webkit-transform':'rotate('+rotacion+'0deg) scale(1)'
               };
            }else{
                rotateCSS = {
                   'opacity':1,
                    '-webkit-transform':'rotate(-'+rotacion+'0deg) scale(1)'
                };
            }
            $('img').eq(cont).css(rotateCSS);
            
                 
            if(fotos.length - 3 == cont){
                cargarImagenes(max_timestamp);
            }
            cont++;
            if(fotos.length == cont){
                clearInterval(slider);
                console.log('se acabó');
            }

        },app.time);
    }
    $('.musica').bind('playing',function(){
        $('body').css('background-image','none');
        cargarImagenes();
        $('.sonando').addClass('play');
        $('audio').css('opacity',0);
        if(app.letra){
            // setTimeout(function(){
            //     cargarUsuario();
            // },17000);
            setTimeout(function(){
                prender(0);
            },27000);
            setTimeout(function(){
                apagar(0);
            },53000);
            setTimeout(function(){
                prender(1);
            },55000);
            setTimeout(function(){
                apagar(1);
            },80000);
            setTimeout(function(){
                prender(2);
            },83000);
            setTimeout(function(){
                apagar(2);
            },109000);
            setTimeout(function(){
                prender(3);
            },110000);
            setTimeout(function(){
                apagar(3);
            },130000);
            setTimeout(function(){
                prender(4);
            },130000);
            setTimeout(function(){
                apagar(4);
            },147000);
            setTimeout(function(){
                prender(5);
            },148000);
            setTimeout(function(){
                apagar(5);
            },173000);
            setTimeout(function(){
                prender(6);
            },175000);
            setTimeout(function(){
                apagar(6);
            },200000);
            setTimeout(function(){
                prender(7);
            },202000);
            setTimeout(function(){
                apagar(7);
                prender(8);
            },222000);
            setTimeout(function(){
                apagar(8);
            },240000);
            setTimeout(function(){
                prender(9);
            },240000);
            setTimeout(function(){
                apagar(9);
                prender(10);

            },250000);
        }
    });
    $('.musica').bind('play',function(){
        // cargarUsuario();
        $('body').css('background-image','url("loading.gif")');
    });
   $('.musica').bind('ended',function(){
        clearInterval(slider);
    });
    function prender(id){
        $('.cancion p').eq(id).addClass('active');
    }
    function apagar(id){
        $('.cancion p').eq(id).removeClass('active');
    }
    $('.si').on('click',function(e){
        e.preventDefault();
        var $boton = $(this),
            url    = $boton.attr('href'),
            width = 400;
        window.open(url,'','width='+width+', height=230');
    });
    $('.no').on('click',function(e){
        e.preventDefault();
        $(this).fadeOut();
    });
});