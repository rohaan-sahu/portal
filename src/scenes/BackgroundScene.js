import * as THREE from 'three';

export function initBackground() {
  const container = document.getElementById('background-canvas');
  if (!container) {
    console.error('Background canvas container not found!');
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const sphereCount = window.innerWidth < 768 ? 5 : 10;
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0x00CCFF, wireframe: true, transparent: true, opacity: 0.8 }),
    new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true, transparent: true, opacity: 0.8 })
  ];
  const glowMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x00CCFF, wireframe: true, transparent: true, opacity: 0.2 }),
    new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true, transparent: true, opacity: 0.2 })
  ];
  const spheres = [];
  const sphereData = [];

  for (let i = 0; i < sphereCount; i++) {
    const materialIndex = Math.random() > 0.5 ? 0 : 1;
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphere = new THREE.Mesh(geometry, materials[materialIndex]);
    
    // Glow effect: slightly larger sphere
    const glowGeometry = new THREE.SphereGeometry(0.55, 32, 32);
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterials[materialIndex]);
    sphere.add(glowSphere); // Attach glow to main sphere

    const initialPos = {
      x: Math.random() * 50 - 25,
      y: Math.random() * 50 - 25,
      z: Math.random() * 50 - 25
    };
    sphere.position.set(initialPos.x, initialPos.y, initialPos.z);
    scene.add(sphere);
    spheres.push(sphere);
    sphereData.push({
      initialPos,
      speed: Math.random() * 0.05 + 0.05, // Faster: 0.05–0.1
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.05, // Faster: ±0.05
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      },
      materialIndex,
      phase: Math.random() * Math.PI * 2, // Random phase for variation
      drift: Math.random() * 0.02 + 0.01 // Random drift for realism
    });
  }

  camera.position.z = 50;

  function onClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres);

    if (intersects.length > 0) {
      const sphere = intersects[0].object;
      const index = spheres.indexOf(sphere);
      const currentMaterialIndex = sphereData[index].materialIndex;
      sphereData[index].materialIndex = currentMaterialIndex === 0 ? 1 : 0;
      sphere.material = materials[sphereData[index].materialIndex];
      sphere.children[0].material = glowMaterials[sphereData[index].materialIndex];
      sphere.scale.set(1.5, 1.5, 1.5);
      setTimeout(() => {
        sphere.scale.set(1, 1, 1);
      }, 200);
    }
  }

  container.addEventListener('click', onClick);
  container.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    onClick({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
  });

  let animationFrameId;
  let time = 0;
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    time += 0.05;

    spheres.forEach((sphere, i) => {
      const data = sphereData[i];
      // Damped oscillations with random drift
      sphere.position.set(
        data.initialPos.x + Math.sin(time * data.speed + data.phase) * 8, // Larger amplitude
        data.initialPos.y + Math.cos(time * data.speed * 0.7 + data.phase) * 8,
        data.initialPos.z + Math.sin(time * data.speed * 0.5 + data.phase) * 8
      );
      // Add subtle random drift
      sphere.position.x += Math.sin(time * data.drift) * 0.5;
      sphere.position.y += Math.cos(time * data.drift) * 0.5;

      // Faster rotation
      sphere.rotation.x += data.rotationSpeed.x;
      sphere.rotation.y += data.rotationSpeed.y;
      sphere.rotation.z += data.rotationSpeed.z;

      // Pulsing effect
      const pulse = 1 + Math.sin(time * data.speed * 2) * 0.05; // Subtle scale change
      sphere.scale.set(pulse, pulse, pulse);
    });

    renderer.render(scene, camera);
  }
  animate();

  const onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    container.removeEventListener('click', onClick);
    container.removeEventListener('touchstart', onClick);
    cancelAnimationFrame(animationFrameId);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    renderer.dispose();
  };
}