import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, RotateCcw, MapPin, Users, Zap } from 'lucide-react';
import './OrbitGlobe.css';

const OrbitGlobe = ({ currentDay, connections = [], points = [], onNodeClick }) => {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [showLegend, setShowLegend] = useState(true);
  const [arcTooltips, setArcTooltips] = useState({});

  // Enhanced sample data with onboarding connections
  const defaultPoints = [
    { id: 'ny', lat: 40.7128, lng: -74.006, name: 'New York', value: 8, color: '#667eea', hires: 12 },
    { id: 'ldn', lat: 51.5074, lng: -0.1278, name: 'London', value: 6, color: '#f093fb', hires: 8 },
    { id: 'blr', lat: 12.9716, lng: 77.5946, name: 'Bengaluru', value: 10, color: '#4facfe', hires: 15 },
    { id: 'sfo', lat: 37.7749, lng: -122.4194, name: 'San Francisco', value: 7, color: '#00d4aa', hires: 9 },
    { id: 'syd', lat: -33.8688, lng: 151.2093, name: 'Sydney', value: 4, color: '#ffd700', hires: 5 },
    { id: 'tok', lat: 35.6762, lng: 139.6503, name: 'Tokyo', value: 5, color: '#ff6b6b', hires: 6 },
    { id: 'ber', lat: 52.5200, lng: 13.4050, name: 'Berlin', value: 3, color: '#a8e6cf', hires: 4 }
  ];

  const defaultConnections = [
    { 
      from: { lat: 40.7128, lng: -74.006, name: 'New York' }, 
      to: { lat: 51.5074, lng: -0.1278, name: 'London' }, 
      strength: 1.4, 
      color: '#7aa2ff',
      hires: 5,
      phase: 'connection'
    },
    { 
      from: { lat: 51.5074, lng: -0.1278, name: 'London' }, 
      to: { lat: 37.7749, lng: -122.4194, name: 'San Francisco' }, 
      strength: 1.2, 
      color: '#4cc9f0',
      hires: 3,
      phase: 'confidence'
    },
    { 
      from: { lat: 37.7749, lng: -122.4194, name: 'San Francisco' }, 
      to: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' }, 
      strength: 1.8, 
      color: '#80ed99',
      hires: 7,
      phase: 'productivity'
    },
    { 
      from: { lat: -33.8688, lng: 151.2093, name: 'Sydney' }, 
      to: { lat: 51.5074, lng: -0.1278, name: 'London' }, 
      strength: 1.1, 
      color: '#fca5a5',
      hires: 2,
      phase: 'connection'
    },
    { 
      from: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' }, 
      to: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' }, 
      strength: 1.5, 
      color: '#ffd93d',
      hires: 4,
      phase: 'confidence'
    }
  ];

  const regions = {
    global: { name: 'Global View', bounds: null },
    americas: { name: 'Americas', bounds: { lat: [15, 70], lng: [-180, -30] } },
    europe: { name: 'Europe & Africa', bounds: { lat: [-35, 70], lng: [-25, 60] } },
    asia: { name: 'Asia Pacific', bounds: { lat: [-50, 70], lng: [60, 180] } }
  };

  const phaseColors = {
    confidence: '#667eea',
    connection: '#f093fb',
    productivity: '#4facfe'
  };

  const finalPoints = points.length > 0 ? points : defaultPoints;
  const finalConnections = connections.length > 0 ? connections : defaultConnections;

  useEffect(() => {
    let cleanup;
    
    (async () => {
      const { default: Globe } = await import('globe.gl');
      
      const g = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .arcsData(finalConnections)
        .arcStartLat(d => d.from.lat)
        .arcStartLng(d => d.from.lng)
        .arcEndLat(d => d.to.lat)
        .arcEndLng(d => d.to.lng)
        .arcColor(d => d.color || '#7aa2ff')
        .arcStroke(d => d.strength || 1)
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .arcsTransitionDuration(1000)
        .pointsData(finalPoints)
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointAltitude(d => d.value * 0.1)
        .pointRadius(d => Math.max(d.value * 0.3, 1))
        .pointColor(d => d.color || '#7aa2ff')
        .pointResolution(8)
        .pointLabel(d => `${d.name}\n${d.hires || 0} new hires`)
        .onPointClick((d) => onNodeClick?.(d))
        .onArcClick((d) => {
          setArcTooltips(prev => ({
            ...prev,
            [`${d.from.name}-${d.to.name}`]: {
              from: d.from.name,
              to: d.to.name,
              hires: d.hires || 0,
              phase: d.phase || 'connection'
            }
          }));
        })
        .width(containerRef.current?.clientWidth || 800)
        .height(containerRef.current?.clientHeight || 600);

      // Mount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(g);
      }
      
      globeRef.current = g;
      g.controls().autoRotate = isAutoRotating;
      g.controls().autoRotateSpeed = 0.5;

      // Resize listener
      const onResize = () => {
        const w = containerRef.current?.clientWidth || 800;
        const h = containerRef.current?.clientHeight || 600;
        g.width(w).height(h);
      };
      
      window.addEventListener('resize', onResize);
      cleanup = () => window.removeEventListener('resize', onResize);
    })();

    return () => cleanup?.();
  }, [finalConnections, finalPoints, onNodeClick, isAutoRotating]);

  const toggleAutoRotate = () => {
    if (!globeRef.current) return;
    const newState = !isAutoRotating;
    globeRef.current.controls().autoRotate = newState;
    setIsAutoRotating(newState);
  };

  const resetView = () => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);
  };

  const focusOnRegion = (regionKey) => {
    if (!globeRef.current) return;
    setSelectedRegion(regionKey);
    
    const region = regions[regionKey];
    if (region.bounds) {
      const { lat, lng } = region.bounds;
      const centerLat = (lat[0] + lat[1]) / 2;
      const centerLng = (lng[0] + lng[1]) / 2;
      const altitude = Math.max(1.5, Math.abs(lat[1] - lat[0]) / 2);
      
      globeRef.current.pointOfView({ lat: centerLat, lng: centerLng, altitude }, 1500);
    } else {
      resetView();
    }
  };

  const captureScreenshot = () => {
    if (!globeRef.current) return;
    const canvas = globeRef.current.renderer().domElement;
    const link = document.createElement('a');
    link.download = `blister-orbit-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="orbit-globe-container"
    >
      {/* Header */}
      <div className="globe-header">
        <div className="header-content">
          <h1>Orbit: Where Your Team Connects 🌍</h1>
          <p>Interactive globe showing real-time onboarding connections across your company</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <Users size={20} />
            <span>{finalPoints.reduce((acc, p) => acc + (p.hires || 0), 0)} Total Hires</span>
          </div>
          <div className="stat-item">
            <Zap size={20} />
            <span>{finalConnections.length} Active Connections</span>
          </div>
        </div>
      </div>

      {/* Globe Container */}
      <div className="globe-wrapper">
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-[#0b1016]">
          {/* Title / Branding */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <h2 className="text-sky-300 font-semibold tracking-wide">Orbit — Blister Connections</h2>
          </div>

          {/* Container where globe.gl mounts */}
          <div ref={containerRef} className="w-full h-full" />

          {/* Controls Overlay */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={toggleAutoRotate}
              className={`px-3 py-1.5 rounded-xl text-white text-sm backdrop-blur transition-all ${
                isAutoRotating 
                  ? 'bg-sky-500 hover:bg-sky-400' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <RotateCcw size={16} className="inline mr-1" />
              {isAutoRotating ? 'Stop Spin' : 'Start Spin'}
            </button>
            
            <button
              onClick={resetView}
              className="px-3 py-1.5 rounded-xl bg-sky-500 text-white text-sm hover:bg-sky-400 transition-all"
            >
              <Camera size={16} className="inline mr-1" />
              Reset View
            </button>
            
            <button
              onClick={captureScreenshot}
              className="px-3 py-1.5 rounded-xl bg-green-500 text-white text-sm hover:bg-green-400 transition-all"
            >
              <Download size={16} className="inline mr-1" />
              Screenshot
            </button>
          </div>

          {/* Region Selector */}
          <div className="absolute top-4 right-4 z-10">
            <select
              value={selectedRegion}
              onChange={(e) => focusOnRegion(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 text-white text-sm backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {Object.entries(regions).map(([key, region]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur rounded-xl p-4 text-white">
              <h3 className="text-sm font-semibold mb-2">Connection Phases</h3>
              <div className="space-y-1">
                {Object.entries(phaseColors).map(([phase, color]) => (
                  <div key={phase} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="capitalize">{phase}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowLegend(false)}
                className="mt-2 text-xs text-gray-400 hover:text-white"
              >
                Hide Legend
              </button>
            </div>
          )}

          {/* Arc Tooltips */}
          {Object.entries(arcTooltips).map(([key, tooltip]) => (
            <div
              key={key}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 backdrop-blur rounded-lg p-3 text-white text-sm max-w-xs"
            >
              <div className="font-semibold">{tooltip.from} → {tooltip.to}</div>
              <div className="text-gray-300">{tooltip.hires} hires onboarded</div>
              <div className="text-xs text-gray-400 capitalize">{tooltip.phase} phase</div>
              <button
                onClick={() => setArcTooltips(prev => {
                  const newTooltips = { ...prev };
                  delete newTooltips[key];
                  return newTooltips;
                })}
                className="absolute top-1 right-1 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>See Your Orbit in Action</h2>
          <p>Experience how Blister Launchpad connects your global team through personalized onboarding journeys</p>
          <div className="cta-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button primary"
            >
              Request a Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button secondary"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrbitGlobe;
