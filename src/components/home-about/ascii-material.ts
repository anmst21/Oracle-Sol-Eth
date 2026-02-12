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
  "#181818",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#AEE900",
];

export function createAsciiMaterial(opts: {
  asciiTexture: THREE.Texture;
  length: number;
  sceneTexture: THREE.Texture;
}) {
  const { asciiTexture, length, sceneTexture } = opts;

  const material = new THREE.NodeMaterial({});

  const uTime = uniform(0);

  const uColor1 = uniform(color(palette[0]));
  const uColor2 = uniform(color(palette[1]));
  const uColor3 = uniform(color(palette[2]));
  const uColor4 = uniform(color(palette[3]));
  const uColor5 = uniform(color(palette[4]));
  const uColor6 = uniform(color(palette[5]));

  const asciiCode = Fn(() => {
    const rnd = attribute("aRandom").x;

    // Animated wave — subtle breathing feel
    const wave = sin(uTime.mul(0.08).add(rnd.mul(6.28)))
      .add(sin(uTime.mul(0.14).add(rnd.mul(3.0))).mul(0.5))
      .add(sin(uTime.mul(0.03)).mul(0.6));

    // Exponent ~1.1 compresses bright areas into mid-range for more tile variety
    const animatedExponentColor = wave.mul(0.1).add(1.1);

    // Animate which ASCII tile is picked — tiles shift over time
    const asciiWave = sin(uTime.mul(0.06).add(rnd.mul(4.0)))
      .mul(0.5)
      .add(0.5);

    // Sample the rendered scene texture
    const textureColor = texture(sceneTexture, attribute("aPixelUV"));
    const brightnessColor = pow(textureColor.r, animatedExponentColor);
    const brightnessAscii = pow(
      textureColor.r,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mix(uniform(1.0) as any, uniform(1.6) as any, asciiWave)
    );

    // ASCII character lookup from pattern atlas
    const asciiUV = vec2(
      uv().x.add(floor(brightnessAscii.mul(length))).div(length),
      uv().y
    );
    const asciiSample = texture(asciiTexture, asciiUV);

    // Step-based color ramp — spread for full gradient with green accents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outColor: any = uColor1;
    outColor = mix(outColor, uColor2, step(0.05, brightnessColor));
    outColor = mix(outColor, uColor3, step(0.12, brightnessColor));
    outColor = mix(outColor, uColor4, step(0.25, brightnessColor));
    outColor = mix(outColor, uColor5, step(0.45, brightnessColor));
    outColor = mix(outColor, uColor6, step(0.65, brightnessColor));

    return vec4(outColor.mul(asciiSample.r), 1.0);
  });

  material.outputNode = asciiCode();
  material.userData.uTime = uTime;

  return material;
}
