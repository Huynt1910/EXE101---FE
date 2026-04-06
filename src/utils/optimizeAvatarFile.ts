type OptimizeAvatarOptions = {
  maxBytes: number;
  maxDimension: number;
  initialQuality?: number;
  minQuality?: number;
};

export type AvatarCropTransform = {
  zoom: number;
  offsetX: number;
  offsetY: number;
  cropSize: number;
};

async function loadImageElement(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () =>
        reject(new Error("Unable to read the selected image."));
      nextImage.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to process the selected image."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function drawCenteredSquareAvatar(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  edgeSize: number,
) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to process the selected image.");
  }

  const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = Math.max(0, Math.floor((image.naturalWidth - cropSize) / 2));
  const sourceY = Math.max(
    0,
    Math.floor((image.naturalHeight - cropSize) / 2),
  );

  canvas.width = edgeSize;
  canvas.height = edgeSize;
  context.clearRect(0, 0, edgeSize, edgeSize);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    edgeSize,
    edgeSize,
  );
}

async function compressSquareCanvas(
  image: HTMLImageElement,
  drawSquare: (canvas: HTMLCanvasElement, edgeSize: number) => void,
  file: File,
  {
    maxBytes,
    maxDimension,
    initialQuality = 0.9,
    minQuality = 0.45,
  }: OptimizeAvatarOptions,
) {
  const initialEdge = Math.max(1, Math.round(maxDimension));
  const canvas = document.createElement("canvas");
  let edgeSize = initialEdge;
  let blob: Blob | null = null;

  while (edgeSize >= 256) {
    drawSquare(canvas, edgeSize);

    let quality = initialQuality;
    blob = await canvasToBlob(canvas, quality);

    while (blob.size > maxBytes && quality > minQuality) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, quality);
    }

    if (blob.size <= maxBytes) {
      break;
    }

    const nextEdgeSize = Math.max(256, Math.round(edgeSize * 0.85));
    if (nextEdgeSize === edgeSize) {
      break;
    }
    edgeSize = nextEdgeSize;
  }

  if (!blob || blob.size > maxBytes) {
    throw new Error(
      "Image is still too large after cropping and compression. Please choose a smaller image.",
    );
  }

  const fileBaseName = file.name.replace(/\.[^/.]+$/, "");

  return new File([blob], `${fileBaseName || "avatar"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function optimizeAvatarFile(
  file: File,
  options: OptimizeAvatarOptions,
) {
  const image = await loadImageElement(file);

  return compressSquareCanvas(
    image,
    (canvas, edgeSize) => drawCenteredSquareAvatar(image, canvas, edgeSize),
    file,
    options,
  );
}

export async function cropAvatarFile(
  file: File,
  transform: AvatarCropTransform,
  options: OptimizeAvatarOptions,
) {
  const image = await loadImageElement(file);
  const baseScale = Math.max(
    transform.cropSize / image.naturalWidth,
    transform.cropSize / image.naturalHeight,
  );
  const displayScale = baseScale * transform.zoom;
  const sourceSize = transform.cropSize / displayScale;
  const unclampedSourceX =
    image.naturalWidth / 2 -
    sourceSize / 2 -
    transform.offsetX / displayScale;
  const unclampedSourceY =
    image.naturalHeight / 2 -
    sourceSize / 2 -
    transform.offsetY / displayScale;
  const sourceX = Math.min(
    Math.max(0, unclampedSourceX),
    Math.max(0, image.naturalWidth - sourceSize),
  );
  const sourceY = Math.min(
    Math.max(0, unclampedSourceY),
    Math.max(0, image.naturalHeight - sourceSize),
  );

  return compressSquareCanvas(
    image,
    (canvas, edgeSize) => {
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Unable to process the selected image.");
      }

      canvas.width = edgeSize;
      canvas.height = edgeSize;
      context.clearRect(0, 0, edgeSize, edgeSize);
      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        edgeSize,
        edgeSize,
      );
    },
    file,
    options,
  );
}
