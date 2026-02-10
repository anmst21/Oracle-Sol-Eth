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

const palette = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#AEE900",
];

export function createAsciiMaterial(opts: {
  asciiTexture: THREE.Texture;
  charCount: number;
  sceneTexture: THREE.Texture;
}) {
  const { asciiTexture, charCount, sceneTexture } = opts;

  const material = new THREE.NodeMaterial({});

  const uTime = uniform(0);

  const uColor1 = uniform(color(palette[0]));
  const uColor2 = uniform(color(palette[1]));
  const uColor3 = uniform(color(palette[2]));
  const uColor4 = uniform(color(palette[3]));
  const uColor5 = uniform(color(palette[4]));
  const uColor6 = uniform(color(palette[5]));

  const asciiCode = Fn(() => {
    const uRange = uniform(1);
    const uBase = uniform(1);

    const wave = sin(uTime.mul(0.12))
      .add(sin(uTime.mul(0.9)).mul(0.3))
      .add(sin(uTime.mul(0.03)).mul(0.5))
      .add(attribute("aRandom").x.mul(0.2));

    const uRangeColor = uniform(0.1);
    const uBaseColor = uniform(0.2);

    const waveColor = sin(uTime.mul(0.12))
      .add(sin(uTime.mul(0.9)).mul(0.3))
      .add(sin(uTime.mul(0.03)).mul(0.5))
      .add(attribute("aRandom").x.mul(0.2));

    const animatedExponent = wave.mul(uRange).add(uBase);
    const animatedExponentColor = waveColor.mul(uRangeColor).add(uBaseColor);

    // Sample the rendered scene texture
    const textureColor = texture(sceneTexture, attribute("aPixelUV"));
    const brightness = pow(textureColor.r, animatedExponent);
    const brightnessColor = pow(textureColor.r, animatedExponentColor);
    const brightnessAscii = pow(textureColor.r, 2);

    // ASCII character lookup
    const asciiUV = vec2(
      uv().x.add(floor(brightnessAscii.mul(charCount))).div(charCount),
      uv().y
    );
    const asciiSample = texture(asciiTexture, asciiUV);

    // Palette color ramp (base — no glow)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let finalColor: any = uColor1;
    finalColor = mix(finalColor, uColor2, step(0.1, brightness));
    finalColor = mix(finalColor, uColor3, step(0.3, brightness));
    finalColor = mix(finalColor, uColor4, step(0.5, brightness));

    // Full color ramp (always visible now — no displacement switching)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outColor: any = uColor1;
    outColor = mix(outColor, uColor2, step(0.1, brightnessColor));
    outColor = mix(outColor, uColor3, step(0.3, brightnessColor));
    outColor = mix(outColor, uColor4, step(0.5, brightnessColor));
    outColor = mix(outColor, uColor5, step(0.7, brightnessColor));
    outColor = mix(outColor, uColor6, step(0.95, brightnessColor));

    return vec4(asciiSample.rgb.mul(outColor), 1.0);
  });

  material.outputNode = asciiCode();
  material.userData.uTime = uTime;

  return material;
}
