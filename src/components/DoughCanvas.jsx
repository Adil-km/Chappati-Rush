import React, { useRef, useEffect, useState } from 'react';
import { applyRollingPinStroke } from '../utils/doughPhysics';
import { drawTargetShapeOutline, SHAPES } from '../utils/shapeTargets';
import { soundManager } from '../utils/audio';

const CANVAS_SIZE = 600;

export default function DoughCanvas({ dough, setDough, isInteractive = true, targetShapeType = SHAPES.CIRCLE, targetTitle = '180px Circle' }) {
  const canvasRef = useRef(null);
  const [isRolling, setIsRolling] = useState(false);
  const mousePos = useRef({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 });
  const lastMousePos = useRef(null);
  const pinAngle = useRef(0);

  // Generate fixed flour dust particle coordinates
  const flourParticles = useRef(
    Array.from({ length: 45 }, () => ({
      x: Math.random() * CANVAS_SIZE,
      y: Math.random() * CANVAS_SIZE,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.2
    }))
  );

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const { centerX, centerY, radii, numVertices } = dough;

      // 1. Clear background
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // 2. Render Kitchen Tawa / Rolling Board Base
      const tawaRadius = 260;
      const tawaGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, tawaRadius);
      tawaGrad.addColorStop(0, '#5a220f');
      tawaGrad.addColorStop(0.85, '#3a1306');
      tawaGrad.addColorStop(1, '#240a02');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, tawaRadius, 0, Math.PI * 2);
      ctx.fillStyle = tawaGrad;
      ctx.fill();
      ctx.strokeStyle = '#85371b';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Inner wood ring texture
      ctx.beginPath();
      ctx.arc(centerX, centerY, tawaRadius - 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // 3. Render Flour Dust Particles
      flourParticles.current.forEach(p => {
        ctx.fillStyle = `rgba(254, 243, 199, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render Target Shape Outline (Dynamic Shape: Circle, Oval, Square, etc.)
      drawTargetShapeOutline(ctx, targetShapeType, centerX, centerY, targetTitle);

      // 5. Render Deformable Dough Mesh
      if (radii && radii.length > 0) {
        ctx.save();
        ctx.beginPath();

        for (let i = 0; i < numVertices; i++) {
          const angle = (i / numVertices) * Math.PI * 2;
          const nextAngle = ((i + 1) / numVertices) * Math.PI * 2;
          
          const r1 = radii[i];
          const r2 = radii[(i + 1) % numVertices];

          const x1 = centerX + r1 * Math.cos(angle);
          const y1 = centerY + r1 * Math.sin(angle);
          const x2 = centerX + r2 * Math.cos(nextAngle);
          const y2 = centerY + r2 * Math.sin(nextAngle);

          if (i === 0) {
            ctx.moveTo(x1, y1);
          }
          // Control point for smooth quadratic curve
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          ctx.quadraticCurveTo(x1, y1, midX, midY);
        }
        ctx.closePath();

        // Dough organic gradient
        const doughGrad = ctx.createRadialGradient(centerX - 15, centerY - 15, 10, centerX, centerY, 150);
        doughGrad.addColorStop(0, '#fef08a');
        doughGrad.addColorStop(0.4, '#fde047');
        doughGrad.addColorStop(0.85, '#eab308');
        doughGrad.addColorStop(1, '#ca8a04');

        ctx.fillStyle = doughGrad;
        ctx.fill();

        // Dough boundary stroke
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Dough inner highlight texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        ctx.restore();
      }

      // 6. Render Rolling Pin Graphic (Always tracks cursor when interactive)
      if (isInteractive && mousePos.current) {
        const { x: px, y: py } = mousePos.current;
        const angle = pinAngle.current;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);

        const pinBodyWidth = 130;
        const pinBodyHeight = 24;
        const handleWidth = 28;
        const handleHeight = 12;

        // Shadow
        ctx.fillStyle = isRolling ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(0, 12, pinBodyWidth / 2 + handleWidth, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left Handle
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.roundRect(-pinBodyWidth / 2 - handleWidth, -handleHeight / 2, handleWidth, handleHeight, 4);
        ctx.fill();

        // Right Handle
        ctx.beginPath();
        ctx.roundRect(pinBodyWidth / 2, -handleHeight / 2, handleWidth, handleHeight, 4);
        ctx.fill();

        // Roller Wood Body
        const rollerGrad = ctx.createLinearGradient(0, -pinBodyHeight / 2, 0, pinBodyHeight / 2);
        rollerGrad.addColorStop(0, '#f59e0b');
        rollerGrad.addColorStop(0.5, '#d97706');
        rollerGrad.addColorStop(1, '#92400e');

        ctx.fillStyle = rollerGrad;
        ctx.beginPath();
        ctx.roundRect(-pinBodyWidth / 2, -pinBodyHeight / 2, pinBodyWidth, pinBodyHeight, 6);
        ctx.fill();

        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Roller shine lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-pinBodyWidth / 2 + 10, -pinBodyHeight / 4);
        ctx.lineTo(pinBodyWidth / 2 - 10, -pinBodyHeight / 4);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [dough, isInteractive, isRolling]);

  // Helper to extract canvas coordinates from event
  const getCanvasCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return null;
    return {
      x: (clientX - rect.left) * (CANVAS_SIZE / rect.width),
      y: (clientY - rect.top) * (CANVAS_SIZE / rect.height)
    };
  };

  // Pointer Event Handlers
  const handlePointerDown = (e) => {
    if (!isInteractive) return;
    const coords = getCanvasCoords(e);
    if (!coords) return;

    setIsRolling(true);
    mousePos.current = coords;
    lastMousePos.current = coords;
  };

  const handlePointerMove = (e) => {
    if (!isInteractive) return;
    const coords = getCanvasCoords(e);
    if (!coords) return;

    const prevPos = mousePos.current || coords;
    mousePos.current = coords;

    const dx = coords.x - prevPos.x;
    const dy = coords.y - prevPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 2) {
      // Calculate roller rotation angle aligned perpendicular to stroke
      pinAngle.current = Math.atan2(dy, dx) + Math.PI / 2;
    }

    if (isRolling && lastMousePos.current) {
      const p1 = lastMousePos.current;
      const p2 = coords;
      const strokeDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      if (strokeDist > 3) {
        // Apply physical deformation to dough
        setDough(prevDough => applyRollingPinStroke(prevDough, p1.x, p1.y, p2.x, p2.y, 140));

        // Play rolling friction sound
        soundManager.playRoll(strokeDist / 5.0);
        lastMousePos.current = p2;
      }
    }
  };

  const handlePointerUp = () => {
    if (isRolling) {
      setIsRolling(false);
      soundManager.stopRoll();
    }
    lastMousePos.current = null;
  };

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '600px',
          maxHeight: '600px',
          touchAction: 'none',
          cursor: isInteractive ? 'none' : 'default',
          margin: 'auto',
          display: 'block'
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
    </div>
  );
}
