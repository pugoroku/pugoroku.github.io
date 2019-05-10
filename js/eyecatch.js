$(() => {
    const calculateHeight = (width) => {
        const height = width / 16 * 9;
        if (height > 480) { return 480; }
        if (height < 200) { return 200; }
        return height;
    }

    const eyecatch = $("#eyecatch");
    const width = eyecatch.width();
    const height = calculateHeight(width);

    const renderer = new THREE.WebGLRenderer({
        canvas: eyecatch[0],
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 4);
    camera.position.set(0, 0.2, 1);

    $(window).resize(() => {
        window.setTimeout(() => {
            const width = window.innerWidth; // FIXME
            const height = calculateHeight(width);
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    });

    { // floor
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.set(-Math.PI / 2, 0, 0);
        plane.position.set(0, -0.01, 0);
        scene.add(plane);
    }

    { // sugoroku
        const geometry = new THREE.PlaneGeometry(0.424, 1.694);
        const texture = new THREE.TextureLoader().load("/img/texture/sugoroku.png");
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        const material = new THREE.MeshLambertMaterial({
            map: texture,
            alphaTest: 0.5,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(-0.04, 0, -0.06);
        plane.rotation.set(-Math.PI / 2, 0, 0);
        scene.add(plane);
    }

    { // dice
        const geometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
        const materials = [];
        const textureLoader = new THREE.TextureLoader();
        for (const i of [3, 4, 1, 6, 2, 5]) {
            const texture = textureLoader.load("/img/texture/" + i + ".png");
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            const material = new THREE.MeshLambertMaterial({
                map: texture,
            });
            materials.push(material);
        }
        const dice = new THREE.Mesh(geometry, materials);
        dice.position.set(0.17, 0.01, 0.02);
        dice.rotation.set(0, 25 / 180 * Math.PI, 0);
        scene.add(dice);
    }

    const createCharacterObject = (name) => {
        const characterObject = new THREE.Object3D();
        { // board
            const geometry = new THREE.PlaneGeometry(0.04, 0.065);
            const texture = new THREE.TextureLoader().load("/img/texture/" + name + ".png");
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = 16;
            const material = new THREE.MeshLambertMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.5,
            });
            const plane = new THREE.Mesh(geometry, material);
            characterObject.add(plane);
        }
        { // stand
            const geometry = new THREE.CylinderGeometry(0.015, 0.015, 0.01, 64);
            const material = new THREE.MeshLambertMaterial({ color: 0xdfdfdf });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(0, -0.033, 0);
            characterObject.add(cylinder);
        }
        return characterObject;
    }

    const babbit = createCharacterObject("babbit");
    { // babbit
        babbit.position.set(0, 0.038, 0);
        babbit.rotation.set(0, -10 / 180 * Math.PI, 0);
        scene.add(babbit);
    }

    const addrisu = createCharacterObject("addrisu");
    { // babbit
        addrisu.position.set(0.03, 0.038, -0.21);
        addrisu.rotation.set(0, 32 / 180 * Math.PI, 0);
        scene.add(addrisu);
    }

    const proguma = createCharacterObject("proguma");
    { // babbit
        proguma.position.set(0.06, 0.038, 0.08);
        proguma.rotation.set(0, 21 / 180 * Math.PI, 0);
        scene.add(proguma);
    }

    const lockon = createCharacterObject("lockon");
    { // babbit
        lockon.position.set(-0.02, 0.038, -0.59);
        lockon.rotation.set(0, -5 / 180 * Math.PI, 0);
        scene.add(lockon);
    }

    { // light
        const light = new THREE.DirectionalLight(0xffffff);
        light.target = babbit;
        light.intensity = 0.6;
        light.position.set(0, 5, 4);
        scene.add(light);
    }

    { // ambient
        const light = new THREE.AmbientLight(0xffffff);
        light.intensity = 0.55;
        scene.add(light);
    }

    const rotationPeriod = 13.0;
    const baseDistance = 0.8;
    const distanceAmplitude = 0.3;
    const distancePeriod = 17.0;
    const baseY = 0.2;
    const yAmplitude = 0.1;
    const yPeriod = 19.0;

    const start = Date.now();

    const render = () => {
        requestAnimationFrame(render);

        const current = Date.now();
        const time = (current - start) / 1000;

        const distance = baseDistance + distanceAmplitude * Math.cos((Math.PI * 2) * time / distancePeriod);
        const y = baseY + yAmplitude * Math.cos((Math.PI * 2) * -time / yPeriod);
        const rotationAngle = (Math.PI * 2) * time / rotationPeriod - Math.PI;
        camera.position.set(distance * Math.cos(rotationAngle), y, distance * Math.sin(rotationAngle));
        camera.lookAt(babbit.position);

        renderer.render(scene, camera);
    };
    render();
});