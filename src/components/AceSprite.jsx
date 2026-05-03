// Animated sprite — driven by a pre-rendered GIF in /public/ace.gif.
// The GIF is small native pixel art; we scale it up with image-rendering: pixelated
// and let CSS transforms handle the per-state pose (mirror for batting, lean for pitching).

const SPRITE_SRC = "/ace.gif";

const ANIMATION_TRANSFORM = {
  idle:  "scaleX(1)",
  pitch: "scaleX(1) translateX(-3px) rotate(-6deg)",
  bat:   "scaleX(-1) translateX(-2px)",
};

export default function AceSprite({ animation = "idle", size = 120 }) {
  // Maintain the original 3:4 aspect ratio
  const height = Math.round(size * (160 / 120));
  const transform = ANIMATION_TRANSFORM[animation] || ANIMATION_TRANSFORM.idle;

  return (
    <div
      className={`ace-wrapper ace-wrapper--${animation}`}
      style={{ width: size, height }}
    >
      <img
        src={SPRITE_SRC}
        alt="Ace — baseball player sprite"
        width={size}
        height={height}
        style={{
          width: size,
          height,
          imageRendering: "pixelated",
          display: "block",
          transform,
          transformOrigin: "center bottom",
          transition: "transform 200ms steps(2)",
        }}
      />
    </div>
  );
}
