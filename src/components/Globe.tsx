import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Earth sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const texture = new THREE.TextureLoader().load('/placeholder.svg?height=2048&width=4096')
    const material = new THREE.MeshPhongMaterial({ map: texture })
    const earth = new THREE.Mesh(geometry, material)
    scene.add(earth)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // Position camera
    camera.position.z = 3

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 1.5
    controls.maxDistance = 10
    controls.maxPolarAngle = Math.PI

    // Animation
    function animate() {
      requestAnimationFrame(animate)
      controls.update() // Update controls in the animation loop
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      controls.dispose() // Dispose of the controls when unmounting
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '10vh' }} />
}
