import * as THREE from "three/webgpu";
import {
  color,
  Fn,
  uniform,
  vec2,
  vec4,
  floor,
  uv,
  texture,
  attribute,
  pow,
  mix,
  step,
  sin,
} from "three/tsl";

// smoothstep(edge0, edge1, x): hermite interpolation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const smoothstep = (edge0: number, edge1: number, x: any) => {
  const t = x.sub(edge0).div(edge1 - edge0).clamp(0, 1);
  return t.mul(t).mul(uniform(3).sub(t.mul(2)));
};

const palette = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#AEE900",
];

export function createCtaAsciiMaterial(opts: {
  asciiTexture: THREE.Texture;
  asciiTextureAlt: THREE.Texture;
  length: number;
  displacementTexture: THREE.Texture;
  imageTexture: THREE.Texture;
}) {
  const { asciiTexture, asciiTextureAlt, length, displacementTexture, imageTexture } = opts;

  const material = new THREE.NodeMaterial({});

  const uTime = uniform(0);
  const uReveal = uniform(0);

  const uColor1 = uniform(color(palette[0]));
  const uColor2 = uniform(color(palette[1]));
  const uColor3 = uniform(color(palette[2]));
  const uColor4 = uniform(color(palette[3]));
  const uColor5 = uniform(color(palette[4]));
  const uColor6 = uniform(color(palette[5]));

  const asciiCode = Fn(() => {
    // Animated wave — prominent breathing feel
    const rnd = attribute("aRandom").x;
    const wave = sin(uTime.mul(0.08).add(rnd.mul(6.28)))
      .add(sin(uTime.mul(0.14).add(rnd.mul(3.0))).mul(0.5))
      .add(sin(uTime.mul(0.03)).mul(0.6));

    const animatedExponent = wave.mul(0.6).add(1.4);
    const animatedExponentColor = wave.mul(0.2).add(0.4);

    // Animate which ASCII tile is picked — tiles shift over time
    const asciiWave = sin(uTime.mul(0.06).add(rnd.mul(4.0)))
      .mul(0.5)
      .add(0.5);

    // Base brightness from image
    const textureColor = texture(imageTexture, attribute("aPixelUV"));
    const brightness = pow(textureColor.r, animatedExponent);
    const brightnessColor = pow(textureColor.r, animatedExponentColor);
    const brightnessAscii = pow(textureColor.r, mix(uniform(2.5), uniform(5.0), asciiWave));
    const brightnessAsciiInv = pow(uniform(1.0).sub(textureColor.r), mix(uniform(1.5), uniform(3.0), asciiWave));

    // ASCII lookup UVs
    const asciiUV = vec2(
      uv().x.add(floor(brightnessAscii.mul(length))).div(length),
      uv().y
    );
    // Inverted lookup — dark areas get dense symbols
    const asciiUVInv = vec2(
      uv().x.add(floor(brightnessAsciiInv.mul(length))).div(length),
      uv().y
    );

    // Sample both atlases
    const asciiSampleA = texture(asciiTextureAlt, asciiUVInv);
    const asciiSampleB = texture(asciiTexture, asciiUV);

    // --- Color ramps ---

    // Idle/default — inverted: dark areas are bright (scaled by reveal)
    const invBrightness = uniform(1.0).sub(brightness).mul(uReveal);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let finalColor: any = uColor1;
    finalColor = mix(finalColor, uColor2, smoothstep(0.05, 0.15, invBrightness));
    finalColor = mix(finalColor, uColor3, smoothstep(0.2, 0.4, invBrightness));
    finalColor = mix(finalColor, uColor4, smoothstep(0.4, 0.6, invBrightness));
    finalColor = mix(finalColor, uColor5, smoothstep(0.6, 0.8, invBrightness));
    // Rare green accents
    const greenChance = step(0.96, attribute("aRandom").x).mul(
      step(0.5, invBrightness)
    );
    finalColor = mix(finalColor, uColor6, greenChance);

    // Hover — normal: reveals actual image with horizontal bars + toxic green
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let finalColorShow: any = uColor1;
    finalColorShow = mix(finalColorShow, uColor2, step(0.1, brightnessColor));
    finalColorShow = mix(finalColorShow, uColor3, step(0.3, brightnessColor));
    finalColorShow = mix(finalColorShow, uColor4, step(0.5, brightnessColor));
    finalColorShow = mix(finalColorShow, uColor5, step(0.65, brightnessColor));
    finalColorShow = mix(finalColorShow, uColor6, step(0.82, brightnessColor));

    // Displacement mask
    const dispSample = texture(displacementTexture, attribute("aPixelUV"));
    const dispMask = step(0.1, dispSample.r);

    // Blend shape and color based on displacement
    const outColor = mix(finalColor, finalColorShow, dispMask);
    const outShape = mix(asciiSampleA.r, asciiSampleB.r, dispMask);

    return vec4(outColor.mul(outShape), 1.0);
  });

  material.outputNode = asciiCode();
  material.userData.uTime = uTime;
  material.userData.uReveal = uReveal;

  return material;
}
