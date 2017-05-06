function Gif() {
	this.animationDuration = 0.6;
	this.squares = [];
	this.colors = [0xA6ACEC, 0xFFFFD2];
	this.index = 0;
	this.nbRepeat = 0;
}

Gif.prototype.init = function init() {
	this.scene = new THREE.Scene();
	this.initCamera();
	this.initRenderer();
	this.initLights();

	this.createSquares();

	this.render();
};

Gif.prototype.initCamera = function initCamera() {
	this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
	this.camera.position.y = 500;
	this.camera.position.z = 500;
	this.camera.position.x = 500;
	this.camera.updateProjectionMatrix();
	this.camera.lookAt(this.scene.position);
};

Gif.prototype.initRenderer = function initRenderer() {
	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.setClearColor( 0xC7F5FE, 1 );
	document.body.appendChild(this.renderer.domElement);
};

Gif.prototype.initLights = function initLights() {
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 100, 0 );
	this.scene.add( light );
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 100, 0, 0 );
	this.scene.add( light );
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 0, 100 );
	this.scene.add( light );
};

Gif.prototype.createSquares = function createSquares() {
	this.squareGroup = new THREE.Group();
	this.scene.add(this.squareGroup);

	this.row1 = new THREE.Group();
	this.squareGroup.add(this.row1);

	this.squarePivot = new THREE.Object3D();
	this.squareGroup.add(this.squarePivot);

	this.row3 = new THREE.Group();
	this.squareGroup.add(this.row3);
	
	this.tl = new TimelineMax({repeat: -1, delay: 2, onRepeat: this.onRepeatAnimation.bind(this)});
	for ( var k=0 ; k<3 ; ++k ) {
		for ( var j=0 ; j<3 ; ++j ) {
			for (var i = 0 ; i<3 ; ++i ) {
				this.index++;
				this.geometry = new THREE.BoxGeometry( 50, 50, 50 );
				this.material = new THREE.MeshLambertMaterial({color : this.colors[this.index%2], shading: THREE.FlatShading});
				this.square = new THREE.Mesh(this.geometry, this.material);
				this.square.position.x = (i-1)*50;
				this.square.position.y = (j-1)*50;
				this.square.position.z = (k-1)*50;
				this.squares.push(this.square);
				this.squareGroup.add(this.square);

				if ( i == 2 ) {
					this.row1.add(this.square);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50+10, ease: Expo.easeIn}, 0);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50, ease: Expo.easeOut}, this.animationDuration);
				} else if ( i == 0 ) {
					this.row3.add(this.square);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50-10, ease: Expo.easeIn}, 0);
					this.tl.to(this.square.position, this.animationDuration, {x: (i-1)*50, ease: Expo.easeOut}, this.animationDuration);
				} else {
					this.squarePivot.add(this.square);
					this.tl.fromTo(this.squarePivot.rotation, this.animationDuration*1.6, {x: 0}, {x: Math.PI/2, ease: Expo.easeInOut}, this.animationDuration*0.2);
				}
			}
		}
	}
};

Gif.prototype.onRepeatAnimation = function onRepeatAnimation() {
	if (this.nbRepeat == 0) {
		this.squareGroup.rotation.y = Math.PI/2;
		this.squareGroup.rotation.z = 0;
	} else if (this.nbRepeat == 1) {
		this.squareGroup.rotation.y = 0;
		this.squareGroup.rotation.z = Math.PI/2;
	} else {
		this.squareGroup.rotation.y = 0;
		this.squareGroup.rotation.z = 0;
	}
	this.nbRepeat = ( this.nbRepeat+1 > 2 ) ? 0 : this.nbRepeat+1;
};

Gif.prototype.render = function render() {
	requestAnimationFrame(this.render.bind(this));
	this.renderer.render(this.scene, this.camera);
};

var squareGif = new Gif();
squareGif.init();