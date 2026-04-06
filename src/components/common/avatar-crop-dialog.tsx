"use client";

import * as React from "react";
import { LoaderCircle, RotateCcw, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AvatarCropTransform } from "@/utils/optimizeAvatarFile";

const STAGE_WIDTH = 360;
const STAGE_HEIGHT = 420;
const CROP_SIZE = 244;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type AvatarCropDialogProps = {
  open: boolean;
  imageSrc: string | null;
  isSubmitting?: boolean;
  onConfirm: (transform: AvatarCropTransform) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function AvatarCropDialog({
  open,
  imageSrc,
  isSubmitting = false,
  onConfirm,
  onOpenChange,
}: Readonly<AvatarCropDialogProps>) {
  const [imageSize, setImageSize] = React.useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  React.useEffect(() => {
    if (!open || !imageSrc) {
      setImageSize(null);
      return;
    }

    let isMounted = true;
    const image = new Image();
    image.onload = () => {
      if (!isMounted) return;
      setImageSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.src = imageSrc;

    return () => {
      isMounted = false;
    };
  }, [imageSrc, open]);

  React.useEffect(() => {
    if (!open) return;
    setZoom(MIN_ZOOM);
    setOffsetX(0);
    setOffsetY(0);
  }, [imageSrc, open]);

  const baseScale = React.useMemo(() => {
    if (!imageSize) return 1;
    return Math.max(
      CROP_SIZE / imageSize.width,
      CROP_SIZE / imageSize.height,
    );
  }, [imageSize]);

  const displayWidth = imageSize ? imageSize.width * baseScale : CROP_SIZE;
  const displayHeight = imageSize ? imageSize.height * baseScale : CROP_SIZE;
  const scaledDisplayWidth = displayWidth * zoom;
  const scaledDisplayHeight = displayHeight * zoom;
  const scaledMaxOffsetX = Math.max(0, (scaledDisplayWidth - CROP_SIZE) / 2);
  const scaledMaxOffsetY = Math.max(0, (scaledDisplayHeight - CROP_SIZE) / 2);

  React.useEffect(() => {
    setOffsetX((current) => clamp(current, -scaledMaxOffsetX, scaledMaxOffsetX));
    setOffsetY((current) => clamp(current, -scaledMaxOffsetY, scaledMaxOffsetY));
  }, [scaledMaxOffsetX, scaledMaxOffsetY]);

  const beginDrag = (clientX: number, clientY: number) => {
    dragStartRef.current = { x: clientX, y: clientY, offsetX, offsetY };
    setIsDragging(true);
  };

  const updateDrag = React.useCallback(
    (clientX: number, clientY: number) => {
      const start = dragStartRef.current;
      if (!start) return;

      setOffsetX(
        clamp(
          start.offsetX + (clientX - start.x),
          -scaledMaxOffsetX,
          scaledMaxOffsetX,
        ),
      );
      setOffsetY(
        clamp(
          start.offsetY + (clientY - start.y),
          -scaledMaxOffsetY,
          scaledMaxOffsetY,
        ),
      );
    },
    [scaledMaxOffsetX, scaledMaxOffsetY],
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      updateDrag(event.clientX, event.clientY);
    };
    const handlePointerUp = () => {
      dragStartRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, updateDrag]);

  const handleConfirm = async () => {
    await onConfirm({
      zoom,
      offsetX,
      offsetY,
      cropSize: CROP_SIZE,
    });
  };

  const handleZoomChange = (nextZoom: number) => {
    setZoom((currentZoom) => {
      const safeZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const zoomRatio = safeZoom / currentZoom;
      const nextMaxOffsetX = Math.max(0, (displayWidth * safeZoom - CROP_SIZE) / 2);
      const nextMaxOffsetY = Math.max(0, (displayHeight * safeZoom - CROP_SIZE) / 2);

      setOffsetX((currentOffsetX) =>
        clamp(currentOffsetX * zoomRatio, -nextMaxOffsetX, nextMaxOffsetX),
      );
      setOffsetY((currentOffsetY) =>
        clamp(currentOffsetY * zoomRatio, -nextMaxOffsetY, nextMaxOffsetY),
      );

      return safeZoom;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop avatar</DialogTitle>
          <DialogDescription>
            Drag the image to reposition it, then zoom if needed. Everything inside the square guide will be used.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className={cn(
                "relative overflow-hidden rounded-[28px] border border-border bg-secondary/30 shadow-inner select-none",
                isDragging ? "cursor-grabbing" : "cursor-grab",
              )}
              style={{
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
                touchAction: "none",
              }}
              onPointerDown={(event) => beginDrag(event.clientX, event.clientY)}
            >
              {imageSrc && imageSize ? (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2"
                  style={{
                    width: displayWidth,
                    height: displayHeight,
                    transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Avatar crop preview"
                    draggable={false}
                    className="h-full w-full max-w-none"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              ) : null}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_37%,rgba(15,23,42,0.48)_37.1%,rgba(15,23,42,0.48)_100%)]" />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.28)]"
                style={{ width: CROP_SIZE, height: CROP_SIZE }}
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/95"
                style={{
                  width: CROP_SIZE,
                  height: CROP_SIZE,
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-px bg-white/70"
                style={{ width: CROP_SIZE, transform: "translate(-50%, -50%)" }}
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 w-px bg-white/70"
                style={{ height: CROP_SIZE, transform: "translate(-50%, -50%)" }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/25" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <ZoomIn className="h-4 w-4" />
                Zoom
              </div>
              <span className="font-medium text-foreground">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={String(MIN_ZOOM)}
              max={String(MAX_ZOOM)}
              step="0.01"
              value={zoom}
              onChange={(event) => handleZoomChange(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setZoom(MIN_ZOOM);
              setOffsetX(0);
              setOffsetY(0);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!imageSrc || isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Apply crop"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
