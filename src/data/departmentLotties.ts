// Lightweight Lottie JSON animations for department icons (100x100 viewbox, 30fps)

// 1. Heartbeat Animation (Cardiology, Gynaecology)
const heartLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Heartbeat",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Heart Shape",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.4, 0.4], y: [1, 1] }, o: { x: [0.2, 0.2], y: [0, 0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.4, 0.4], y: [1, 1] }, o: { x: [0.2, 0.2], y: [0, 0] }, t: 15, s: [118, 118, 100] },
            { i: { x: [0.4, 0.4], y: [1, 1] }, o: { x: [0.2, 0.2], y: [0, 0] }, t: 25, s: [100, 100, 100] },
            { i: { x: [0.4, 0.4], y: [1, 1] }, o: { x: [0.2, 0.2], y: [0, 0] }, t: 35, s: [112, 112, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, -10], [-10, 0], [0, 12], [0, 0], [0, 0], [10, 0], [0, -10]],
                  o: [[0, 10], [10, 0], [0, 0], [0, 0], [0, 12], [-10, 0], [0, -10]],
                  v: [[-18, -12], [-3, -25], [0, 22], [0, 22], [3, -25], [18, -12], [0, 5]],
                  c: true
                }
              }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.95, 0.25, 0.25, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ]
    }
  ]
};

// 2. Stethoscope Pulse Animation (General OPD, Surgery, Chest, etc.)
const stethoscopeLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Stethoscope",
  ddd: 0,
  assets: [],
  layers: [
    // Outer Pulse Ring
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse Ring",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [80] },
            { t: 40, s: [0] },
            { t: 60, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [70, 70, 100] },
            { t: 40, s: [140, 140, 100] },
            { t: 60, s: [140, 140, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", s: { a: 0, k: [50, 50] }, p: { a: 0, k: [0, 0] } },
            { ty: "st", c: { a: 0, k: [0.98, 0.75, 0.2, 1] }, w: { a: 0, k: 3 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    },
    // Stethoscope Main
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Stethoscope Core",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-4] },
            { t: 30, s: [4] },
            { t: 60, s: [-4] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[-12, 0], [0, 12], [12, 0], [0, -12]],
                  o: [[12, 0], [0, -12], [-12, 0], [0, 12]],
                  v: [[0, 20], [20, 0], [0, -20], [-20, 0]],
                  c: true
                }
              }
            },
            { ty: "st", c: { a: 0, k: [1, 1, 1, 1] }, w: { a: 0, k: 6 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        },
        {
          ty: "gr",
          it: [
            { ty: "el", s: { a: 0, k: [18, 18] }, p: { a: 0, k: [0, 0] } },
            { ty: "fl", c: { a: 0, k: [0.98, 0.75, 0.2, 1] } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 3. Activity / Bone ECG Pulse (Orthopedics)
const activityLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Activity ECG",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse Line",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100] },
            { t: 30, s: [108, 108, 100] },
            { t: 60, s: [95, 95, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  v: [[-35, 0], [-18, 0], [-10, -25], [0, 25], [10, -15], [18, 0], [35, 0]],
                  c: false
                }
              }
            },
            { ty: "st", c: { a: 0, k: [0.98, 0.75, 0.2, 1] }, w: { a: 0, k: 6 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 4. Baby Care Animation (Pediatrics)
const babyLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Baby Care",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Baby Face",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-6] },
            { t: 30, s: [6] },
            { t: 60, s: [-6] }
          ]
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 30, s: [106, 106, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", s: { a: 0, k: [46, 46] }, p: { a: 0, k: [0, 0] } },
            { ty: "fl", c: { a: 0, k: [1, 1, 1, 1] } },
            { ty: "st", c: { a: 0, k: [0.98, 0.75, 0.2, 1] }, w: { a: 0, k: 4 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        },
        {
          ty: "gr",
          it: [
            { ty: "el", s: { a: 0, k: [6, 6] }, p: { a: 0, k: [-10, -5] } },
            { ty: "el", s: { a: 0, k: [6, 6] }, p: { a: 0, k: [10, -5] } },
            { ty: "fl", c: { a: 0, k: [0.04, 0.42, 0.3, 1] } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 5. Flask / Lab Bubble Animation (Radiology, Gastro, Dialysis)
const flaskLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Lab Flask",
  ddd: 0,
  assets: [],
  layers: [
    // Bubbles
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Rising Bubbles",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              s: { a: 0, k: [8, 8] },
              p: {
                a: 1,
                k: [
                  { t: 0, s: [0, 15] },
                  { t: 60, s: [0, -25] }
                ]
              }
            },
            { ty: "fl", c: { a: 0, k: [0.98, 0.75, 0.2, 1] } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    },
    // Flask Outer
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Flask Outline",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  v: [[-8, -25], [8, -25], [8, -10], [22, 20], [-22, 20]],
                  c: true
                }
              }
            },
            { ty: "st", c: { a: 0, k: [1, 1, 1, 1] }, w: { a: 0, k: 5 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 6. Shield Alert / Emergency Pulse (24/7 ER)
const shieldAlertLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Shield Emergency",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Emergency Pulse",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 20, s: [115, 115, 100] },
            { t: 40, s: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [15, -5], [0, 15], [-15, -5]],
                  o: [[15, -5], [0, 15], [-15, -5], [0, 0]],
                  v: [[0, -28], [22, -18], [0, 26], [-22, -18]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { a: 0, k: [0.85, 0.2, 0.2, 1] } },
            { ty: "st", c: { a: 0, k: [1, 1, 1, 1] }, w: { a: 0, k: 4 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

export const getDepartmentLottieData = (iconType: string) => {
  switch (iconType) {
    case 'heart':
      return heartLottie;
    case 'stethoscope':
      return stethoscopeLottie;
    case 'activity':
      return activityLottie;
    case 'baby':
      return babyLottie;
    case 'flask':
      return flaskLottie;
    case 'shield-alert':
      return shieldAlertLottie;
    default:
      return stethoscopeLottie;
  }
};
