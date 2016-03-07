$(document).ready(function(){


    // userAgent check
    // ===============================================================
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
        var sp = true;
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        var sp = true;
    }
    var sp = false;

    // vars
    // ===============================================================
    var $target = $('#stage')
    var width = $target.width();
    var height = $target.height();
    var imgs = {
        img001: 'assets/images/004.jpg',
        img002: 'assets/images/002.jpg'
    };
    var img = {};
    $.each(imgs, function(i, value) {
        console.log(value);
        img[i] = new Image();
        img[i].src = value;
    });

    var img01 = THREE.ImageUtils.loadTexture(img.img001.src);
    var img02 = THREE.ImageUtils.loadTexture(img.img002.src);
    var animate;
    var animateStart = true;
    var jairo = true;
    // Configure
    // ---------------------------------------------------------------
    var helper = false;
    var windowResize = false;

    // Click EVENT
    // ===============================================================
    var projector = new THREE.Projector();
    //マウスのグローバル変数
    var mouse = { x: 0, y: 0 };
    //オブジェクト格納グローバル変数
    var targetList = [];

    $(window).on('mouseup', function(ev) {
        if (ev.target == renderer.domElement) {
            //マウス座標2D変換
            var rect = ev.target.getBoundingClientRect();
            mouse.x =  ev.clientX - rect.left;
            mouse.y =  ev.clientY - rect.top;

            //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
            mouse.x =  (mouse.x / width) * 2 - 1;
            mouse.y = -(mouse.y / height) * 2 + 1;

            // マウスベクトル
            var vector = new THREE.Vector3( mouse.x, mouse.y ,1);

            // vector はスクリーン座標系なので, オブジェクトの座標系に変換
            projector.unprojectVector( vector, camera );

            // 始点, 向きベクトルを渡してレイを作成
            var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

            // クリック判定
            var obj = ray.intersectObjects( targetList );
            console.log(obj);
            // クリックしていたら、alertを表示
            if ( obj.length > 0 ){
                console.log(obj[0].object.name);
                if(obj[0].object.name == "home"){
                    toHome();
                }else{
                    toFloor();
                    addHome(homeButton);
                    removeCtrlObj(floorButton);
                }
            }

        }
    });



    // scene
    // ===============================================================
    var scene = new THREE.Scene();

    // geometries
    // ===============================================================
    var geometry = new THREE.SphereGeometry( 5, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    // Mesh
    // ===============================================================
    // Sphere Set
    var material = new THREE.MeshBasicMaterial({
        map: img01
    });
    sphere = new THREE.Mesh( geometry, material );
    scene.add(sphere);

    // Circle Set
    var floorButton = new THREE.Mesh(
        new THREE.CircleGeometry( 2, 45 ,Math.PI / 2),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x78c762
        })
    );

    var homeButton = new THREE.Mesh(
        new THREE.CircleGeometry( 2, 45 ,Math.PI / 2),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x1d63c1
        })
    );

    function addFloor(obj){
        obj.position.set(4,0,0);
        obj.scale.set(0.1,0.1,0.1);
        obj.name = 'floor';
        scene.add(obj);
        obj.rotation.set(0,1.5,-2);
        targetList.push(obj);
    };
    addFloor(floorButton);


    function addHome(obj){
        obj.position.set(-4,0,-1);
        obj.scale.set(0.1,0.1,0.1);
        obj.name = 'home';
        scene.add(obj);
        obj.rotation.set(0,1.5,-2);
        targetList.push(obj);
    };
    // addHome(homeButton);

    function removeCtrlObj(obj){
        scene.remove(obj);
    };


    //camera
    // ===============================================================
    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0,0,1);
    camera.lookAt(sphere.position);

    //helper
    // ===============================================================
    if(helper){
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0,0,0);
        scene.add(axis);
    }

    //render
    // ===============================================================
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width,height);
    renderer.setClearColor({color: 0x000000});
    document.getElementById('stage').appendChild(renderer.domElement);
    renderer.render(scene,camera);

    //control
    // ===============================================================
    var gcontrols;
    var controls;
    function device(){
        if(sp && jairo){
            gcontrols = new THREE.DeviceOrientationControls(camera, renderer.domElement);
        }else{
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            // Config
            controls.autoRotate = true;     //true:自動回転する,false:自動回転しない
            controls.autoRotateSpeed = 0.5;    //自動回転する時の速度
            controls.minDistance = 0;
            controls.maxDistance = 5;
            // this.minZoom = 0;
    		// this.maxZoom = 5;
            controls.noKeys = true;
        }
    }
    device();

    // Rendering
    // ===============================================================
    function render(){

        if(windowResize){
            window.addEventListener( 'resize', onWindowResize, false );
        }

        if(!jairo){
            gcontrols.disconnect();
            gcontrols.update();
        }

        if(sp && jairo){
            gcontrols.connect();
            gcontrols.update();
        }else{
            // camera.rotation.y += 0.05 * Math.PI/180;
            // sphere.rotation.set(0,0,0);
            controls.update();
        }

        requestAnimationFrame(render);
        renderer.clear();
        renderer.render(scene,camera);

        animateStart = true;

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    // Controller
    // ===============================================================
    function startAnime(){
        controls.autoRotate = true;
        controls.update();
        animateStart = true;
    }

    function stopAnime(){
        controls.autoRotate = false;
        controls.update();
        animateStart = false;
    }

    function stopJairo(){
        jario = false;
        device();
    }

    function ctrlbtn() {
        if(animateStart){
            $('.ctrl-stop').show();
            $('.ctrl-play').hide();
        }else{
            $('.ctrl-stop').hide();
            $('.ctrl-play').show();
        }
    };
    ctrlbtn();

    function toFloor(){
        material.map = img02;
        addHome(homeButton);
        removeCtrlObj(floorButton);
        $('.m-home').removeClass('fn-active');
        $('.m-floor').addClass('fn-active');
    };
    function toHome(){
        material.map = img01;
        addFloor(floorButton);
        removeCtrlObj(homeButton);
        $('.m-floor').removeClass('fn-active');
        $('.m-home').addClass('fn-active');
    };

    $('.ctrl-stop').on('click', function(){
        stopAnime();
        ctrlbtn();
    });
    $('.ctrl-play').on('click', function(){
        startAnime();
        ctrlbtn();
    });

    $('.m-floor').on('click', function(){
        toFloor();
    });
    $('.m-home').on('click', function(){
        toHome();
    });

    $('#view').on('click', function(event) {
        $('.modal-window').css('display','table');
        render();
    });

    $(".modal-window").on('click', function(event) {
        $(this).hide();
    });

    $("#stage").on('click', function(event) {
        event.stopPropagation();
    });

});
