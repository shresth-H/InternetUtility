# Image Processing Architecture

## Overview

Image processing tools handle formats including JPEG, PNG, WebP, AVIF, and GIF. Operations range from light browser canvas transformations (for instant feedback) to heavy server-side rasterization and neural network background removal.

## Supported Operations

| Tool | Implementation Engine | Processing Mode |
|------|-----------------------|-----------------|
| **Compress Image** | Sharp / mozjpeg / libvips | Server / Canvas WebAssembly |
| **Resize Image** | Sharp / Lanczos3 filter | Server / Canvas |
| **Crop Image** | Canvas UI with server export | Client / Server |
| **JPG to PNG** | Sharp / Canvas | Client / Server |
| **PNG to JPG** | Sharp / Canvas | Client / Server |
| **WebP Converter** | libwebp / Sharp | Client / Server |
| **Background Remover** | ONNX Runtime / Rembg model | Server worker |

## Storage & Caching
- Direct presigned uploads prevent server memory exhaustion on high-resolution photography.
- Output formats use content-disposition headers for instant browser downloading.
- Automatic cleanup ensures privacy and minimizes storage costs.

