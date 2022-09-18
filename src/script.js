const dragSpaceTarget = document.querySelector("body");
let globalTargetElement = dragSpaceTarget;

function dragStart(event) {
    const element = event.target;
    const draggable = element.dragProperties;

    if (draggable) {
        draggable.active = true;
        if (event.type === "touchstart") {
            draggable.pointerStart.xPos = event.touches[0].clientX;
            draggable.pointerStart.yPos = event.touches[0].clientY;
        } else {
            draggable.pointerStart.xPos = event.clientX;
            draggable.pointerStart.yPos = event.clientY;
        }

        globalTargetElement = element;
    }
}

function setTransform(element, xPos = 0, yPos = 0, angle = 0) {
    element.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${angle}deg)`;
}

function dragMotion(event) {
    const element = event.target;
    const draggable = element.dragProperties;

    if (draggable) {
        const dragMotionActivated =
            draggable.active &&
            draggable.pointerStart.xPos &&
            draggable.pointerStart.yPos;

        if (dragMotionActivated) {
            event.preventDefault();

            let pointerXOffset = 0;
            let pointerYOffset = 0;

            if (event.type === "touchmove") {
                pointerXOffset =
                    event.touches[0].clientX - draggable.pointerStart.xPos;
                pointerYOffset =
                    event.touches[0].clientY - draggable.pointerStart.yPos;
            } else {
                pointerXOffset = event.clientX - draggable.pointerStart.xPos;
                pointerYOffset = event.clientY - draggable.pointerStart.yPos;
            }
            let pointerDirAngle = Math.atan2(pointerYOffset, pointerXOffset);
            pointerDirAngle *= 180 / Math.PI;

            draggable.current.xOffset =
                draggable.previous.xOffset + pointerXOffset;
            draggable.current.yOffset =
                draggable.previous.yOffset + pointerYOffset;
            draggable.current.rotation =
                draggable.previous.rotation + pointerDirAngle;

            setTransform(
                element,
                draggable.current.xOffset,
                draggable.current.yOffset,
                draggable.current.rotation
            );
        }
    }
}

function dragEnd() {
    const element = globalTargetElement;
    const draggable = element.dragProperties;

    if (draggable) {
        const dragMotionPerformed =
            draggable.active &&
            draggable.current.xOffset &&
            draggable.current.yOffset;

        if (dragMotionPerformed) {
            draggable.previous.xOffset = draggable.current.xOffset;
            draggable.previous.yOffset = draggable.current.yOffset;
            draggable.active = false;
            draggable.pointerStart.xPos = null;
            draggable.pointerStart.yPos = null;
        }
    }
}

function makeElementDraggable(element, initialRotation = 0) {
    element.dragProperties = {
        active: false,
        previous: {
            xOffset: 0,
            yOffset: 0,
            rotation: initialRotation
        },
        current: {
            xOffset: null,
            yOffset: null,
            rotation: null
        },
        pointerStart: {
            xPos: null,
            yPos: null
        }
    };
}

function waitDragEvent(dragSpace) {
    const airplane = document.querySelector("#airplane");
    makeElementDraggable(airplane, 45);

    dragSpace.addEventListener("mousedown", dragStart, false);
    dragSpace.addEventListener("mousemove", dragMotion, false);
    dragSpace.addEventListener("mouseup", dragEnd, false);

    dragSpace.addEventListener("touchstart", dragStart, false);
    dragSpace.addEventListener("touchmove", dragMotion, false);
    dragSpace.addEventListener("touchend", dragEnd, false);
}

// Call main function:
waitDragEvent(dragSpaceTarget);
