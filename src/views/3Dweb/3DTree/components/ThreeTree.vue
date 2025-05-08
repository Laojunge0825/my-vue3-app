<template>
  <div ref="container" class="scene-container">
    <div v-if="currentLevel > 0" class="control-panel">
      <button class="back-btn" @click="goBack">← 返回上级 (层级 {{ currentLevel }})</button>
    </div>
    <div class="info-panel">当前节点: {{ currentNodeInfo }}</div>
  
    <!-- 独立弹窗组件 -->
    <Tooltip
      :visible="tooltip.visible"
      :x="tooltip.x"
      :y="tooltip.y"
      :title="tooltip.title"
      :content="tooltip.content"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Tooltip from './Tooltip.vue';

const props = defineProps({
  treeData: {
    type: Object,
    required: true,
    validator: data => data.id && data.name // 验证对象结构
  },
  styleConfig: {
    type: Object,
    default: () => ({
      root: { type: 'box', color: 0xff4444, size: 8 },
      branch: { type: 'cylinder', color: 0x44ff44, size: 5 },
      leaf: { type: 'sphere', color: 0x4444ff, size: 3 }
    })
  }
});

const container = ref(null);
let scene, camera, renderer, controls, raycaster;
const mouse = new THREE.Vector2();

// 响应式状态
const sceneStack = ref([]);
const currentLevel = ref(0);
const currentParentNode = ref(null);
const currentNodeInfo = computed(() => 
  currentParentNode.value?.name || props.treeData[0]?.name || '无节点'
);

// 工具提示状态
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  content: {}
});

// 初始化Three.js场景
function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 100);

  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 光照系统
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 15);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 地面
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  
  scene.add(ground);

  raycaster = new THREE.Raycaster();

  // 事件监听
  window.addEventListener('dblclick', onDoubleClick);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
}

// 创建3D节点
function createNode(node, nodeType) {
  if (!node) return null;


  let geometry;
  const config = props.styleConfig[nodeType];

  switch(config.type) {
    case 'box':
      geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(config.size, config.size, config.size * 2, 8);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(config.size, 32, 32);
      break;
    default:
      geometry = new THREE.SphereGeometry(2, 32, 32);
  }

  // 根据节点类型和温度设置颜色
  const baseColor = nodeType === 'root' 
    ? 0xff4444 
    : nodeType === 'branch'
      ? 0x44ff44
      : getTempColor(node.temperature || 25); // 默认温度25度

  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
    emissive: 0x000000,
    emissiveIntensity: 0.5
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // 边框高亮
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  mesh.add(line);

  mesh.userData = {
    node,
    nodeType,
    parent: currentParentNode.value,
    id: `${nodeType}-${node.id || 'unknown'}`
  };

  return mesh;
}

// 计算节点位置
function calculateNodePositions(nodes, level) {
  const positions = [];
  const parentPos = currentParentNode.value?.position || new THREE.Vector3();
  const radius = 15 + (level * 10);
  const angleStep = (Math.PI * 2) / nodes.length;

  nodes.forEach((_, index) => {
    const angle = angleStep * index;
    const variance = radius * 0.2 * Math.random();
  
    positions.push(new THREE.Vector3(
      parentPos.x + Math.cos(angle) * (radius + variance),
      level * 12,
      parentPos.z + Math.sin(angle) * (radius + variance)
    ));
  });

  return positions;
}

// 加载当前层级
function loadCurrentLevel() {
  scene.children = scene.children.filter(child => 
    child.isLight || child.name === 'ground'
  );

  let nodes = [];
  if (currentLevel.value === 0) {
    // 适配对象结构
    nodes = [props.treeData];
    if (props.treeData.children) {
      nodes.push(...props.treeData.children);
    }
  } else {
    nodes = currentParentNode.value?.children || [];
  }

  const positions = calculateNodePositions(nodes, currentLevel.value);
  nodes.forEach((node, index) => {
    const nodeType = currentLevel.value === 0 
      ? (index === 0 ? 'root' : 'branch')
      : 'leaf';
  
    const nodeMesh = createNode(node, nodeType);
    if (nodeMesh) {
      nodeMesh.position.copy(positions[index]);
      scene.add(nodeMesh);
    }
  });

  // 自动聚焦到场景中心
    const nodeMeshes = scene.children.filter(child => child.userData?.nodeType);
  const centerX = nodeMeshes.length > 0 ? 
   nodeMeshes.reduce((sum, mesh) => sum + mesh.position.x, 0) / nodeMeshes.length : 0;
  
  const centerZ = nodeMeshes.length > 0 ? 
   nodeMeshes.reduce((sum, mesh) => sum + mesh.position.z, 0) / nodeMeshes.length : 0;

  controls.target.set(
   centerX,
   currentLevel.value * 12,
   centerZ
  );

  controls.update();
}

// 鼠标移动处理
function onMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    scene.children.filter(obj => obj.userData?.node),
    true
  );

  if (intersects.length > 0) {
    const hit = intersects[0].object.parent;
    const data = hit.userData?.node;
    const userData = hit.userData;

    if (data) {
      tooltip.value = {
        visible: true,
        x: event.clientX + 15,
        y: event.clientY + 15,
        title: data.name || '未命名节点',
        content: {
          ID: data.id || '未知',
          '节点类型': nodeTypeMap[userData.nodeType],
          '温度值': `${userData.node.temperature}°C`,
          '状态': getTempStatus(userData.node.temperature)
        }
      };

      hit.material.emissive.setHex(0x666666);
    }
  } else {
    tooltip.value.visible = false;
    scene.children.forEach(obj => {
      if (obj.material) obj.material.emissive.setHex(0x000000);
    });
  }
}

// 获取温度状态描述
const getTempStatus = (temp) => {
  if (temp < 25) return '正常';
  if (temp < 30) return '注意';
  return '警告';
};

const getTempColor = (temperature) => {
  // 定义温度颜色区间
  const tempRanges = [
    { min: 18, max: 25, color: 0x0000ff }, // 蓝色  
    { min: 25, max: 28, color: 0x00ff00 }, // 绿色
    { min: 28, max: 30, color: 0xffff00 }, // 黄色
    { min: 30, max: 35, color: 0xff0000 }  // 红色
  ];

  // 确保温度值有效
  const validTemp = Number.isFinite(temperature) ? temperature : 25;

  // 查找匹配的温度区间
  const matchedRange = tempRanges.find(range => 
    validTemp >= range.min && validTemp <= range.max
  );

  // 返回匹配的颜色或默认灰色
  return matchedRange?.color || 0x888888;
};

// 节点类型映射
const nodeTypeMap = {
  root: '根节点',
  branch: '分支节点',
  leaf: '叶子节点'
};

// 双击事件处理
function onDoubleClick(event) {
  if (!event.target.isEqualNode(renderer.domElement)) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    scene.children.filter(obj => obj.userData?.nodeType),
    true
  );

  if (intersects.length > 0) {
    const clickedObj = intersects[0].object.parent;
    const userData = clickedObj.userData;
  
    if (userData.nodeType === 'branch' && userData.node.children?.length) {
      sceneStack.value.push({
        level: currentLevel.value,
        parent: currentParentNode.value,
        cameraPos: camera.position.clone(),
        target: controls.target.clone()
      });
    
      currentLevel.value++;
      currentParentNode.value = userData.node;
      loadCurrentLevel();
    
      camera.position.set(
        clickedObj.position.x,
        currentLevel.value * 15 + 30,
        clickedObj.position.z + 50
      );
      controls.update();
    }
  }
}

// 返回上级
function goBack() {
  if (sceneStack.value.length > 0) {
    const prevState = sceneStack.value.pop();
  
    currentLevel.value = prevState.level;
    currentParentNode.value = prevState.parent;
  
    camera.position.copy(prevState.cameraPos);
    controls.target.copy(prevState.target);
    controls.update();
  
    loadCurrentLevel();
  }
}

// 窗口调整
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环
function animate() {
  requestAnimationFrame(animate);

  scene.children.forEach(child => {
    if (child.userData?.nodeType) {
      child.rotation.y += 0.005;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

// 生命周期
onMounted(() => {
  initThree();
  loadCurrentLevel();
  animate();
});

onUnmounted(() => {
  ['dblclick', 'resize', 'mousemove'].forEach(event => {
    window.removeEventListener(event);
  });
  renderer.dispose();
});
</script>

<style>
.scene-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}

.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.back-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: Arial;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.back-btn:hover {
  background: #fff;
  transform: translateY(-1px);
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-family: Arial;
  background: rgba(0,0,0,0.7);
  padding: 8px 16px;
  border-radius: 4px;
}
</style>