
$(function(){

    //Variables de la aplicación
    var cliente;
    var app;
    var fotos = [];
    var slider;
    var $musica = $('.musica');

    //variables de facebook
    var next_url_facebook;
    var estado = {
        login : function(status){
            if(status){
                $('.log-in').addClass('hidden');
                // $('.audio').show();
            }else{
                $('.log-in').removeClass('hidden');
                // $('.audio').hide();
            }
        }
    };
    var analytics = {
        login : function(cliente){
             _gaq.push(['_trackEvent', 'login' , 'social' , cliente ]);
        }
    };
    var facebook = {
        estado : function(data){
            if(data.status !== 'connected'){
                facebook.login();
                if(window.location.href.split('#')[1] === undefined){
                    estado.login(false);
                }

            }else{
                if(window.location.href.split('#')[1] === undefined){
                    estado.login(true);
                }
                facebook.fotos();
            }
        },
        login : function(){
            $('.facebook').on('click',function(e){
                e.preventDefault();
                FB.login(function(response){
                    // console.log(response);
                    if (response.status === 'connected') {
                        estado.login(true);
                        facebook.fotos();
                    }
                },{scope: 'publish_stream,user_photos'});
            });
        },
        fotos : function(){
            var publicacion = {
                message:'Estoy viendo mis mejores momentos',
                link : 'http://leonidasesteban.com/tu-fotografia/',
                name: 'Tu Fotografía',
                picture:'http://leonidasesteban.com/tu-fotografia/pauveelez.jpg',
                description:'Revive conmigo tus mejores momentos'
            };
            FB.api('/me/feed','post',publicacion,function(response){
                console.log(response);
            });
            app = {
                mp3 : 'midnight-city.mp3',
                letra : false,
                allImage : false,
                time : 3000,
            };

            cliente = 'facebook';
            analytics.login(cliente);
            FB.api('/me/photos', function(response) {
                next_url_facebook = response.paging.next;
                $.each(response.data,function(i, item){
                    fotos.push(item);
                    // console.log(item);
                });
                tuFotografia.loginExitoso();
            });

        },
        masFotos : function(){
            $.getJSON(next_url_facebook, function(response){
                next_url_facebook = response.paging.next;
                $.each(response.data,function(i, item){
                    fotos.push(item);
                });
            });
        },
        init : function(){
            FB.init({
                appId: '759039674125354',
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true,  // parse XFBML
                locale : 'es_ES',
            });
            FB.getLoginStatus(facebook.estado);
        }

    };
    facebook.init();

    var pantalla = {
        fullScreen : function(element){
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
           
        },
        botonFullScreen : function(){
            $('.instagram').on('click',function(){
                pantalla.fullScreen(document.documentElement);
            });
        },
        utilidades : function(){
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
        },
        salir : function(){
            $('.salir').on('click',function(e){
                e.preventDefault();
                if(cliente === 'facebook'){
                    FB.logout(function(){
                        window.location.reload();
                    });
                }else{
                    window.location.href = window.location.href.split('#')[0];
                }
                
                
            });
        },
        init : function(){
            pantalla.salir();
            pantalla.botonFullScreen();
            pantalla.utilidades();
        }
    };
    pantalla.init();
    
    
    //Variables de instagram
    var cliet_id;
    var host    = window.location.href;
    var user_id;
    var id;
    var datos;
    var max_timestamp;
    var access_parameters;
    

    var instagram = {
        preguntar_login : function(){
            if(host !== "http://192.168.10.112:8000/"){
                client_id = '7c8f23d19cce4815b86d76100c97bf56';
            }else{
                client_id = '07fb6ffc314a4c5cbb00f55a6ec3a0aa';
            }
            var url_login = 'https://instagram.com/oauth/authorize/?client_id='+client_id+'&redirect_uri='+host+'&response_type=token';
            $('.log-in, .audio').css('top',$(window).height()/2 - 50);
            $('.instagram').attr('href',url_login);
            if(window.location.href.split('#')[1] !== undefined){
                cliente = 'instagram';
                analytics.login(cliente);
                var access_token = (window.location.href.split('#')[1]).split('=')[1];
                access_parameters = {access_token:access_token};
                instagram.cargarUsuario(access_parameters);
                estado.login(true);
            }else{
                // alert('hola')
                // estado.login(true);
            }
        },
        cargarUsuario : function(){
            $.getJSON('https://api.instagram.com/v1/users/self?callback=?',access_parameters,function(data){
                datos = data.data;
                id = datos.id;
                // id = "276630535";
                if(datos.username == "pauveelez"){
                    app = {
                        mp3 : 'tu-fotografia.mp3',
                        letra : true,
                        allImage : false,
                        time : 5000,
                    };
                }else{
                    app = {
                        mp3 : 'midnight-city.mp3',
                        letra : false,
                        allImage : true,
                        time : 3000,
                    };
                }
                tuFotografia.loginExitoso();
            });

        },

        init : function(){
            instagram.preguntar_login();
            
        }
    };
    instagram.init();
   
    
    var musica = {
        reproduciendo : function(){
            $musica.bind('playing',function(){
                if(cliente == "instagram"){
                    tuFotografia.pedirImagenes('https://api.instagram.com/v1/users/'+id+'/media/recent?count=100&callback=?');
                }else{
                    tuFotografia.transition();
                }
                $('.sonando').addClass('play');
                if(app.mp3 === "midnight-city.mp3"){
                    $('.sonando').addClass('midnight');
                }
                $('.audio').css('opacity',0);
                if(app.letra){
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
                    },250000);
                }
            });
            function prender(id){
                $('.cancion p').eq(id).addClass('active');
            }
            function apagar(id){
                $('.cancion p').eq(id).removeClass('active');
            }
        },
        play : function(){
            $musica.bind('play',function(){
                // $('body').css('background-image','url("loading.gif")');
            });
        },
        fin : function(){
            $musica.bind('ended',function(){
                clearInterval(slider);
            });
        },
        init : function(){
            musica.play();
            musica.reproduciendo();
            musica.fin();
        }
    };
    musica.init();
    
    tuFotografia = {
        loginExitoso : function(){
            $('.profile').removeClass('hidden');
            
            if(cliente === "facebook"){
                FB.api('/me/',function(response){
                    var username = response.username;
                    $('.username').text(response.name);
                });
                FB.api('/me/picture?type=normal',function(avatar){
                    $('.avatar').attr('src',avatar.data.url);
                });
            }else{
                $('.avatar').attr('src',datos.profile_picture);
                $('.username').text(datos.full_name);
            }
            $musica.attr('src',app.mp3);
            if($(window).width() <= 1280){
                $musica.attr('controls','controls');
            }else{
                $musica[0].play();
            }
        },
        pedirImagenes : function(url){
            if(max_timestamp === undefined){
                $.getJSON(url,access_parameters,function(data){
                    tuFotografia.cargarImagenes(data);
                });
            }else{
                $.getJSON('https://api.instagram.com/v1/users/'+id+'/media/recent?count=100&max_timestamp='+max_timestamp+'&callback=?',access_parameters,function(data){
                    tuFotografia.cargarImagenes(data);
                });
            }
        },
        cargarImagenes : function(data){
            var next_url = data.pagination.next_url;
            $.each(data.data,function(i, item){
                if(item.type === 'image'){
                    if(app.allImage){
                        fotos.push(item);
                        // console.log(item);
                    }else{
                        if(item.likes.count >= 11){
                            fotos.push(item);
                        }
                    }
                }

            });
            if(max_timestamp === undefined){

                tuFotografia.transition();
            }
            max_timestamp = fotos[fotos.length-1].caption.created_time;
            fotos.pop();
        },
        transition : function(){
            var cont = 1;
            // $('.fotos').append('<img src="'+fotos[0].images.standard_resolution.url+'" class="foto" style="left:10px; top 50px;">');

            slider = setInterval(function(){
                var imagen;
                // console.log(cliente)

                if(cliente == "facebook"){
                    imagen   = fotos[cont].images[4].source;
                }else{
                    imagen   = fotos[cont].images.standard_resolution.url;
                }

                var left;
                if($(window).width() <= 768){
                    left     = Math.floor((Math.random()*$(window).width())+1);
                }else{
                    left     = Math.floor((Math.random()*($(window).width()/1.5))+1);
                }
                var top      = Math.floor((Math.random()*300)+1);
                var rotacion = Math.floor((Math.random()*3));
                var likes;
                var $img;
                if(cliente == "instagram"){
                    if(app.allImage){
                        likes = (fotos[cont].likes.count)*40;
                    }else{
                        likes = (fotos[cont].likes.count)*20;
                    }
                    $img     = '<img class="foto '+cliente+'" src="'+imagen+'" style="left:'+left+'px; top:'+top+'px; height:'+likes+'px";width:'+likes+'px;">';

                }else{
                    if (fotos[cont].likes){
                        if(fotos[cont].likes.data.length > 20){
                            likes = fotos[cont].likes.data.length * 20;
                        }else{
                            likes = 400;
                        }
                    }else{
                        likes = 5;
                    }
                    $img     = '<img class="foto '+cliente+'" src="'+imagen+'" style="left:'+left+'px; top:'+top+'px; height:'+imagen.height+'; width:'+imagen.width+'px;">';

                }


                $('.fotos').append($img);
                
                var rotateCSS;
                if(cont % 2 === 0 ){
                    rotateCSS = {
                       'opacity':1,
                       '-webkit-transform':'rotate('+rotacion+'0deg) scale(1)'
                    };
                    if(cliente === 'facebook'){
                        if(fotos[cont].name){
                            $('body').append('<p class="texto anim1" style="top:'+top+'px;">'+fotos[cont].name+'</p>');
                        }
                    }else{
                        if(fotos[cont].caption){
                            $('body').append('<p class="texto anim1" style="top:'+top+'px;">'+fotos[cont].caption.text+'</p>');
                        }
                    }
                }else{
                    rotateCSS = {
                       'opacity':1,
                        '-webkit-transform':'rotate(-'+rotacion+'0deg) scale(1)'
                    };
                    if(cliente === 'facebook'){
                        if(fotos[cont].name){
                            $('body').append('<p class="texto anim2" style="top:'+top+'px;">'+fotos[cont].name+'</p>');
                        }
                    }else{
                        if(fotos[cont].caption){
                            $('body').append('<p class="texto anim2" style="top:'+top+'px;">'+fotos[cont].caption.text+'</p>');
                        }
                    }
                }
                $('.fotos img').eq(cont).css(rotateCSS);
                
                     
                if(fotos.length - 6 == cont){
                    if(cliente === "instagram"){
                        tuFotografia.pedirImagenes(max_timestamp);
                    }else{
                        facebook.masFotos();
                    }
                }
                cont++;
                // console.log(fotos.length);
                // console.log(cont);
                if(fotos.length == cont){
                    clearInterval(slider);
                    console.log('se acabó');
                }

            },app.time);
        }
    };
    
});