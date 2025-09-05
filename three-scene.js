// 3D Scene Setup
var scene, camera, renderer, controls, particles, particleSystem, clock;
var isMobile = window.innerWidth < 768;

// Make initThreeScene globally available
window.initThreeScene = function() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.001);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    document.getElementById('hero-canvas').appendChild(renderer.domElement);

    // Controls for desktop
    if (!isMobile) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
    }

    // Clock for animations
    clock = new THREE.Clock();

    // Add lights
    addLights();
    
    // Add 3D elements
    createFloatingShapes();
    createParticles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Directional light
    const dirLight = new THREE.DirectionalLight(0x9d4edd, 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Point lights for glowing effect
    const pointLight1 = new THREE.PointLight(0x6a0dad, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00a2ff, 1, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
}

function createFloatingShapes() {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x6a0dad,
        shininess: 100,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    // Create multiple floating shapes
    for (let i = 0; i < 15; i++) {
        const shape = new THREE.Mesh(geometry, material.clone());
        
        // Random position
        shape.position.x = (Math.random() - 0.5) * 100;
        shape.position.y = (Math.random() - 0.5) * 100;
        shape.position.z = (Math.random() - 0.5) * 100;
        
        // Random size
        const size = Math.random() * 2 + 0.5;
        shape.scale.set(size, size, size);
        
        // Random rotation
        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;
        
        // Store original position for floating animation
        shape.userData = {
            originalY: shape.position.y,
            speed: Math.random() * 0.5 + 0.1,
            amplitude: Math.random() * 0.5 + 0.1
        };
        
        scene.add(shape);
    }
}

function createParticles() {
    const particles = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];
    const colors = [];
    
    const color1 = new THREE.Color(0x6a0dad);
    const color2 = new THREE.Color(0x9d4edd);
    const color3 = new THREE.Color(0x00a2ff);

    for (let i = 0; i < particles; i++) {
        // Positions
        positions.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        
        // Sizes
        sizes.push(Math.random() * 1.5);
        
        // Colors
        const color = new THREE.Color();
        const rand = Math.random();
        if (rand < 0.33) {
            color.copy(color1);
        } else if (rand < 0.66) {
            color.copy(color2);
        } else {
            color.copy(color3);
        }
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    
    // Animate floating shapes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.originalY !== undefined) {
            child.rotation.x += 0.002 * child.userData.speed;
            child.rotation.y += 0.003 * child.userData.speed;
            child.position.y = child.userData.originalY + Math.sin(time * child.userData.speed) * child.userData.amplitude;
        }
    });
    
    // Animate particles
    if (particleSystem) {
        particleSystem.rotation.y = time * 0.05;
        particleSystem.rotation.x = time * 0.03;
    }
    
    // Update controls
    if (controls) controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    isMobile = window.innerWidth < 768;
}

// Initialize when the page is fully loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initThreeScene, 1);
} else {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initThreeScene, 1);
    });
}

// Handle scroll-based animations
window.addEventListener('scroll', () => {
    if (camera) {
        const scrollY = window.scrollY;
        camera.position.z = 30 + scrollY * 0.1;
        camera.position.y = scrollY * 0.1;
    }
});
