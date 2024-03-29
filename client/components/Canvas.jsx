import React, { useState, useEffect, useRef } from "react";
import rough from "roughjs"; //rough is a library with shapes!
import getStroke from "perfect-freehand"; //tool that allows for the freehand drawing

const Canvas = ({ elements, setElements, drawing, setDrawing, sendDrawing }) => {
  const canvasRef = useRef(null);
  const RoughCanvasRef = useRef(null); //useRef allows you to persist values between renders

  useEffect(() => {
    RoughCanvasRef.current = rough.canvas(canvasRef.current);
  }, [toolType]);

  //had to google how the below logic works. We are using HTML Canvas rather than SVG path
  const freeDraw = (context, stroke) => {
    if (!stroke.length) return;

    context.beginPath();
    context.moveTo(stroke[0][0], stroke[0][1]);

    for (let i = 1; i < stroke.length - 2; i++) {
      const [x1, y1] = stroke[i];
      const [x2, y2] = stroke[i + 1];
      const xc = (x1 + x2) / 2;
      const yc = (y1 + y2) / 2;

      context.quadraticCurveTo(x1, y1, xc, yc);
    }

    context.lineTo(stroke[stroke.length - 1][0], stroke[stroke.length - 1][1]);
    context.stroke();
  };

  // tracks users mouse coordinates relative to page
  const handleMouseDown = (e) => {
    setDrawing(true); //update state of canvas
    const { clientX, clientY } = e;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const newElement = createElement([], clientX, clientY);
    setElements((prevState) => [...prevState, newElement]);
    //originally was going with different tools but last minute effort will just go with diff colors
    if (toolType === 'pencil') {
    context.strokeStyle = "#000"; // Set the stroke color
    context.lineWidth = 2; // Set the line width
    } else if (toolType === 'line') {
      context.strokeStyle = '#FF0000';
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing || elements.length === 0) return;
    const { clientX, clientY } = e;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createElement(x1, y1, clientX, clientY);

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
    sendDrawing(elementsCopy); //sends the updated drawing to the other clients
  };

  const handleMouseUp = () => {
    setDrawing(false);
    sendDrawing(elements);// Send the final drawing to other clients
  };

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      Canvas
    </canvas>
  );
};

export default Canvas;
