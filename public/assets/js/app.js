$(document).ready(function(){

    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
        var sp = true;
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        var sp = true;
    }

    // var width = window.innerWidth,
    // height = window.innerHeight;
    var width = 500;
    var height = width * (3 / 4);

    //scene

    var scene = new THREE.Scene();

    //mesh

    var geometry = new THREE.SphereGeometry( 5, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('test.jpg')
    });

    // material.map = 'test.jpg';

    sphere = new THREE.Mesh( geometry, material );

    scene.add( sphere );

    //camera

    var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.set(0,0,0.1);
    camera.lookAt(sphere.position);

    //helper
    var axis = new THREE.AxisHelper(1000);
    axis.position.set(0,0,0);
    scene.add(axis);

    //render

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width,height);
    renderer.setClearColor({color: 0x000000});
    document.getElementById('stage').appendChild(renderer.domElement);
    renderer.render(scene,camera);

    //control

    if(sp){
        var gcontrols = new THREE.DeviceOrientationControls(camera, renderer.domElement);
    }else{
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.noKeys = true;

    var animate;
    var animateStart = true;

    function render(){

        // window.addEventListener( 'resize', onWindowResize, false );

        if(sp){
            gcontrols.connect();
            gcontrols.update();
        }else{
            sphere.rotation.y += 0.05 * Math.PI/180;
            // sphere.rotation.set(0,0,0);
            controls.update();
        }

        requestAnimationFrame(render);
        renderer.clear();
        renderer.render(scene,camera);

        animateStart = true;

    }
    render();

    function commonCtrl(){
        controls.update();
    };

    function startAnime(){
        sphere.rotation.y += 0.05 * Math.PI/180;
        commonCtrl();
        requestAnimationFrame(startAnime);
        animateStart = true;
    }

    function stopAnime(){
        sphere.rotation.y -= 0.05 * Math.PI/180;
        commonCtrl();
        requestAnimationFrame(stopAnime);
        animateStart = false;
    }

    function rendup(){
        console.log('rotate up');
        commonCtrl();
        renderer.clear();
        renderer.render(scene,camera);
        sphere.rotation.x -= Math.PI/180;

    }
    function renddown(){
        console.log('rotate down');
        sphere.rotation.x += Math.PI/180;
        commonCtrl();
    }
    function rendleft(){
        console.log('rotate left');
        controls.rotateLeft(50);
        commonCtrl();
    }
    function rendright(){
        console.log('rotate right');
        sphere.rotation.y += Math.PI/180;
        commonCtrl();
    }
    function rendZoomUP(){
        console.log('zoom up');
        commonCtrl();
        camera.position.z += 0.5;
    }
    function rendZoomOut(){
        console.log('zoom out');
        commonCtrl();
        camera.position.z += 0.5;
        camera.lookAt(sphere.position);
    }

    // function onWindowResize() {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize( window.innerWidth, window.innerHeight );
    // };

    function ctrlbtn() {
        if(animateStart){
            $('.ctrl-stop').css('display','table-cell');
            $('.ctrl-play').hide();
        }else{
            $('.ctrl-stop').hide();
            $('.ctrl-play').css('display','table-cell');
        }
    };
    ctrlbtn();

    $('.ctrl-play').on('click', function(){
        startAnime();
        ctrlbtn();
    });
    $('.ctrl-stop').on('click', function(){
        stopAnime();
        ctrlbtn();
    });
    $('.ctrl-up').on('click', function(){
        rendup();
    });
    $('.ctrl-down').on('click', function(){
        renddown();
    });
    $('.ctrl-left').on('click', function(){
        rendleft();
    });
    $('.ctrl-right').on('click', function(){
        rendright();
    });
    $('.ctrl-zoom-up').on('click', function(){
        rendZoomUP();
    });
    $('.ctrl-zoom-out').on('click', function(){
        rendZoomOut();
    });

});
