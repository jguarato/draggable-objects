const dragSpace = document.querySelector("body");
var targetElement = dragSpace;

dragSpace.addEventListener("mousedown", dragStart, false);
dragSpace.addEventListener("mouseup", dragEnd, false);
dragSpace.addEventListener("mousemove", dragMotion, false);

const airplane = document.querySelector("#airplane");
makeElementDraggable(airplane, 45);

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

function dragStart(event) {
    const element = event.target;
    const draggable = element.dragProperties;

    if (draggable) {
        draggable.active = true;
        draggable.pointerStart.xPos = event.clientX;
        draggable.pointerStart.yPos = event.clientY;

        targetElement = element;
    }
}

function dragEnd() {
    const element = targetElement;
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

            let pointerXOffset = event.clientX - draggable.pointerStart.xPos;
            let pointerYOffset = event.clientY - draggable.pointerStart.yPos;
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

function setTransform(element, xPos = 0, yPos = 0, angle = 0) {
    element.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${angle}deg)`;
}