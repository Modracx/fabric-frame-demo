/*!
 * frame demo for fabric.js
 * Kenneth D'silva (Modracx), Copyright (c) June 2025
 * Licensed under the MIT License – https://opensource.org/licenses/MIT
 */
// FRAME EDITOR DEMO USING FABRIC.JS
const canvas = new fabric.Canvas("canvas");
let frameData, imageData, group;
let isGrouped = false;

// ---------------- ADD IMAGE ----------------
function addImage(e) {
  const btn = e.target;
  btn.disabled = true;

  fabric.Image.fromURL("photo.jpg", (img) => {
    fabric.loadSVGFromURL("frame.svg", (objects, options) => {
      const frame = fabric.util.groupSVGElements(objects, options);
      frame.set({
        fill: "",
        left: 100,
        top: 100,
        scaleX: 1,
        scaleY: 1,
        id: "frame",
      });

      fabric.loadSVGFromURL("frame.svg", (clipObjects, clipOptions) => {
        const clipPath = fabric.util.groupSVGElements(clipObjects, clipOptions);
        clipPath.set({
          absolutePositioned: true,
          left: 100,
          top: 100,
          scaleX: 1,
          scaleY: 1,
        });

        img.set({
          left: 100,
          top: 100,
          scaleX: frame.getScaledWidth() / img.width,
          scaleY: frame.getScaledHeight() / img.height,
          clipPath: clipPath,
          borderColor: "#2563eb",
          cornerColor: "#2563eb",
          cornerSize: 10,
          transparentCorners: false,
          selectable: true,
          id: "photo",
          imgSrc: img._element.currentSrc,
        });

        frameData = frame;
        imageData = img;
        canvas.add(frame, imageData);

        // Keep image aligned with frame
        frame.on("moving", () => syncClip(frame, clipPath, img));
        frame.on("rotating", () => syncClip(frame, clipPath, img, "rotate"));
        frame.on("scaling", () => syncClip(frame, clipPath, img, "scale"));
        moveFrame();
      });
    });
  });
}

// ---------------- SYNC FRAME CLIP ----------------
function syncClip(frame, clipPath, img, mode) {
  if (mode === "rotate") clipPath.set({ angle: frame.angle });
  if (mode === "scale") {
    clipPath.set({ scaleX: frame.scaleX, scaleY: frame.scaleY });
  }
  clipPath.setPositionByOrigin(frame.getCenterPoint(), "center", "center");
  img.set("dirty", true);
  canvas.requestRenderAll();
}

// ---------------- ADJUST IMAGE ----------------
function adjustImage() {
  if (isGrouped) {
    isGrouped = false;
    const items = group._objects;
    group._restoreObjectsState();
    canvas.remove(group);

    items.forEach((item) => {
      if (item.id === "photo") imageData = item;
      if (item.id === "frame") frameData = item;
    });

    console.log(frameData)
    console.log(imageData)

    group = null;
    frameData.fill = '';
    frameData.selectable = false;
    frameData.absolutePositioned = true;
    imageData.clipPath = frameData;
    canvas.add(frameData, imageData);
  }
}

// ---------------- MOVE FRAME ----------------
function moveFrame() {
  if (!isGrouped) {
    isGrouped = true;
    canvas.clear();
    frameData.absolutePositioned = false;
    group = new fabric.Group([imageData, frameData], {
      borderColor: "#2563eb",
      cornerColor: "#2563eb",
      cornerSize: 10,
      transparentCorners: false,
      hasControls: true,
      selectable: true,
      clipPath: frameData,
    });

    console.log(group);
    canvas.add(group);
  }
}

// ---------------- RESET CANVAS ----------------
function resetCanvas() {
  canvas.clear();
  frameData = null;
  imageData = null;
  group = null;
  isGrouped = false;
  document.querySelectorAll(".btn").forEach((b) => (b.disabled = false));
}