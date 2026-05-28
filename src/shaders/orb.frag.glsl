// Glowing sphere, warm gold/amber, with a fresnel rim light.
// Slowly pulses via uTime.
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), 3.0);

  vec3 coreColor = vec3(0.85, 0.60, 0.30); // amber
  vec3 rimColor  = vec3(0.95, 0.75, 0.40); // gold
  vec3 color = mix(coreColor * 0.3, rimColor, fresnel);

  float pulse = sin(uTime * 1.5) * 0.5 + 0.5;
  float alpha = 0.85 - fresnel * 0.3 + pulse * 0.05;

  gl_FragColor = vec4(color, alpha);
}
