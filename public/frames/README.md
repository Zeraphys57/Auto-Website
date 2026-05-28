# Hero frame sequence

The hero `<FrameSequence>` canvas scrubber looks for numbered WebP frames in
this folder:

```
public/frames/frame_0001.webp
public/frames/frame_0002.webp
...
public/frames/frame_0120.webp
```

If no frames are present (the default), the component renders a cinematic
placeholder animation (a car emerging from darkness) — nothing to do.

When you have a real hero video, generate the frames with FFmpeg:

```bash
ffmpeg -i input.mp4 -vf "fps=24,scale=1920:-1" -quality 85 public/frames/frame_%04d.webp
```

Match `frameCount` in `src/components/sections/Hero.jsx` to the number of
frames produced. The component switches to real frames automatically.
