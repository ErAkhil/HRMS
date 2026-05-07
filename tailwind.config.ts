import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{js,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", '"Satoshi"', ...defaultTheme.fontFamily.sans],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "sans-serif"],
        satoshi: ['"Satoshi"', "sans-serif"],
      },
      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",

        // Primary – Indigo Blue
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          foreground: "#FFFFFF",
        },

        // Borders
        stroke: "#E2E8F0",
        "stroke-dark": "#334155",

        // Dark / Navy scale
        dark: {
          DEFAULT: "#0F172A",
          2: "#1E293B",
          3: "#334155",
          4: "#475569",
          5: "#64748B",
          6: "#94A3B8",
          7: "#CBD5E1",
          8: "#E2E8F0",
        },

        // Gray / Surface scale
        gray: {
          DEFAULT: "#F1F5F9",
          dark: "#0F172A",
          1: "#F8FAFC",
          2: "#F1F5F9",
          3: "#E2E8F0",
          4: "#CBD5E1",
          5: "#94A3B8",
          6: "#64748B",
          7: "#475569",
        },

        // Indigo palette (brand)
        indigo: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },

        // Navy
        navy: {
          DEFAULT: "#0F172A",
          light: "#1E293B",
        },

        // Slate Gray
        slate: {
          DEFAULT: "#64748B",
          light: "#94A3B8",
          dark: "#475569",
        },

        // Sky Blue Accent
        sky: {
          DEFAULT: "#38BDF8",
          light: "#BAE6FD",
          dark: "#0284C7",
          50: "#F0F9FF",
        },

        // Emerald – Success
        green: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: {
            DEFAULT: "#34D399",
            1: "#10B981",
            2: "#6EE7B7",
            3: "#A7F3D0",
            4: "#D1FAE5",
            5: "#ECFDF5",
            6: "#F0FDF4",
            7: "#F0FDF4",
          },
        },
        emerald: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
          dark: "#059669",
        },

        // Rose – Error
        red: {
          DEFAULT: "#F43F5E",
          dark: "#E11D48",
          light: {
            DEFAULT: "#FB7185",
            2: "#FDA4AF",
            3: "#FECDD3",
            4: "#FFE4E6",
            5: "#FFF1F2",
            6: "#FFF1F2",
          },
        },
        rose: {
          DEFAULT: "#F43F5E",
          light: "#FFE4E6",
          dark: "#E11D48",
        },

        // Blue / Indigo – Info
        blue: {
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
          light: {
            DEFAULT: "#818CF8",
            2: "#A5B4FC",
            3: "#C7D2FE",
            4: "#E0E7FF",
            5: "#EEF2FF",
          },
        },

        // Amber – Warning
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#D97706",
        },
        orange: {
          light: {
            DEFAULT: "#F59E0B",
          },
        },
        yellow: {
          dark: {
            DEFAULT: "#F59E0B",
            2: "#D97706",
          },
          light: {
            DEFAULT: "#FCD34D",
            4: "#FFFBEB",
          },
        },

        // Violet – AI Accent
        violet: {
          DEFAULT: "#8B5CF6",
          light: "#EDE9FE",
          dark: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },

        // Surface tokens
        surface: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          "dark-bg": "#111827",
          "dark-card": "#1E293B",
        },
      },

      fontSize: {
        display: ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        "heading-1": ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-2": ["30px", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-4": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-5": ["18px", { lineHeight: "1.5", fontWeight: "600" }],
        "heading-6": ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        "body-2xlg": ["22px", "28px"],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "500" }],
        "body-sm": ["14px", "22px"],
        "body-xs": ["12px", "20px"],
        caption: ["12px", { lineHeight: "1.5", fontWeight: "400" }],
      },

      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11: "2.75rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13: "3.25rem",
        13.5: "3.375rem",
        14: "3.5rem",
        14.5: "3.625rem",
        15: "3.75rem",
        15.5: "3.875rem",
        16: "4rem",
        16.5: "4.125rem",
        17: "4.25rem",
        17.5: "4.375rem",
        18: "4.5rem",
        18.5: "4.625rem",
        19: "4.75rem",
        19.5: "4.875rem",
        21: "5.25rem",
        21.5: "5.375rem",
        22: "5.5rem",
        22.5: "5.625rem",
        24.5: "6.125rem",
        25: "6.25rem",
        25.5: "6.375rem",
        26: "6.5rem",
        27: "6.75rem",
        27.5: "6.875rem",
        28.5: "7.125rem",
        29: "7.25rem",
        29.5: "7.375rem",
        30: "7.5rem",
        31: "7.75rem",
        32.5: "8.125rem",
        33: "8.25rem",
        34: "8.5rem",
        34.5: "8.625rem",
        35: "8.75rem",
        36.5: "9.125rem",
        37.5: "9.375rem",
        39: "9.75rem",
        39.5: "9.875rem",
        40: "10rem",
        42.5: "10.625rem",
        44: "11rem",
        45: "11.25rem",
        46: "11.5rem",
        46.5: "11.625rem",
        47.5: "11.875rem",
        49: "12.25rem",
        50: "12.5rem",
        52: "13rem",
        52.5: "13.125rem",
        54: "13.5rem",
        54.5: "13.625rem",
        55: "13.75rem",
        55.5: "13.875rem",
        59: "14.75rem",
        60: "15rem",
        62.5: "15.625rem",
        65: "16.25rem",
        67: "16.75rem",
        67.5: "16.875rem",
        70: "17.5rem",
        72.5: "18.125rem",
        73: "18.25rem",
        75: "18.75rem",
        90: "22.5rem",
        94: "23.5rem",
        95: "23.75rem",
        100: "25rem",
        103: "25.75rem",
        115: "28.75rem",
        125: "31.25rem",
        132.5: "33.125rem",
        150: "37.5rem",
        171.5: "42.875rem",
        180: "45rem",
        187.5: "46.875rem",
        203: "50.75rem",
        230: "57.5rem",
        242.5: "60.625rem",
      },

      borderRadius: {
        sm: "8px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },

      maxWidth: {
        2.5: "0.625rem",
        3: "0.75rem",
        4: "1rem",
        7: "1.75rem",
        9: "2.25rem",
        10: "2.5rem",
        10.5: "2.625rem",
        11: "2.75rem",
        13: "3.25rem",
        14: "3.5rem",
        15: "3.75rem",
        16: "4rem",
        22.5: "5.625rem",
        25: "6.25rem",
        30: "7.5rem",
        34: "8.5rem",
        35: "8.75rem",
        40: "10rem",
        42.5: "10.625rem",
        44: "11rem",
        45: "11.25rem",
        46.5: "11.625rem",
        60: "15rem",
        70: "17.5rem",
        90: "22.5rem",
        94: "23.5rem",
        100: "25rem",
        103: "25.75rem",
        125: "31.25rem",
        132.5: "33.125rem",
        142.5: "35.625rem",
        150: "37.5rem",
        180: "45rem",
        203: "50.75rem",
        230: "57.5rem",
        242.5: "60.625rem",
        270: "67.5rem",
        280: "70rem",
        292.5: "73.125rem",
      },

      maxHeight: {
        35: "8.75rem",
        70: "17.5rem",
        90: "22.5rem",
        550: "34.375rem",
        300: "18.75rem",
      },

      minWidth: {
        22.5: "5.625rem",
        42.5: "10.625rem",
        47.5: "11.875rem",
        75: "18.75rem",
      },

      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        9: "9",
        1: "1",
      },

      opacity: {
        65: ".65",
      },

      aspectRatio: {
        "4/3": "4 / 3",
        "21/9": "21 / 9",
      },

      backgroundImage: {
        video: "url('../images/video/video.png')",
        // AI gradients
        "gradient-ai": "linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)",
        "gradient-ai-soft": "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
        "gradient-brand": "linear-gradient(135deg, #4F46E5 0%, #38BDF8 100%)",
        "gradient-success": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
        "gradient-warning": "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
        "gradient-danger": "linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)",
        "gradient-dark": "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      },

      content: {
        "icon-copy": 'url("../images/icon/icon-copy-alt.svg")',
      },

      transitionProperty: {
        width: "width",
        stroke: "stroke",
      },

      transitionDuration: {
        fast: "150ms",
        DEFAULT: "200ms",
        slow: "300ms",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      borderWidth: {
        6: "6px",
        10: "10px",
        12: "12px",
      },

      boxShadow: {
        // 3-tier elevation system
        card: "0 2px 8px rgba(0,0,0,0.06)",
        floating: "0 8px 24px rgba(0,0,0,0.12)",
        modal: "0 20px 40px rgba(0,0,0,0.18)",
        // AI glow
        "ai-glow": "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)",
        "indigo-glow": "0 0 20px rgba(79, 70, 229, 0.25)",
        "sky-glow": "0 0 16px rgba(56, 189, 248, 0.3)",
        // Legacy shadows (kept for backward compat)
        default: "0px 4px 7px 0px rgba(0, 0, 0, 0.14)",
        error: "0px 12px 34px 0px rgba(13, 10, 44, 0.05)",
        "card-2": "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
        "card-3": "0px 2px 3px 0px rgba(183, 183, 183, 0.50)",
        "card-4": "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        "card-5": "0px 1px 3px 0px rgba(0, 0, 0, 0.13)",
        "card-6": "0px 3px 8px 0px rgba(0, 0, 0, 0.08)",
        "card-7": "0px 0.5px 3px 0px rgba(0, 0, 0, 0.18)",
        "card-8": "0px 1px 2px 0px rgba(0, 0, 0, 0.10)",
        "card-9": "0px 1px 3px 0px rgba(0, 0, 0, 0.08)",
        "card-10": "0px 2px 3px 0px rgba(0, 0, 0, 0.10)",
        switcher:
          "0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 2px #FFFFFF, inset 0px -1px 1px rgba(0, 0, 0, 0.1)",
        "switch-1": "0px 0px 4px 0px rgba(0, 0, 0, 0.10)",
        "switch-2": "0px 0px 5px 0px rgba(0, 0, 0, 0.15)",
        datepicker: "-5px 0 0 #1e293b, 5px 0 0 #1e293b",
        1: "0px 1px 2px 0px rgba(84, 87, 118, 0.12)",
        2: "0px 2px 3px 0px rgba(84, 87, 118, 0.15)",
        3: "0px 8px 8.466px 0px rgba(113, 116, 152, 0.05), 0px 8px 16.224px 0px rgba(113, 116, 152, 0.07), 0px 18px 31px 0px rgba(113, 116, 152, 0.10)",
        4: "0px 13px 40px 0px rgba(13, 10, 44, 0.22), 0px -8px 18px 0px rgba(13, 10, 44, 0.04)",
        5: "0px 10px 30px 0px rgba(79, 70, 229, 0.12), 0px 4px 10px 0px rgba(79, 70, 229, 0.04), 0px -18px 38px 0px rgba(79, 70, 229, 0.04)",
        6: "0px 12px 34px 0px rgba(13, 10, 44, 0.08), 0px 34px 26px 0px rgba(13, 10, 44, 0.05)",
        7: "0px 18px 25px 0px rgba(113, 116, 152, 0.05)",
      },

      dropShadow: {
        card: "0px 8px 13px rgba(0, 0, 0, 0.07)",
        1: "0px 1px 0px #E2E8F0",
        2: "0px 1px 4px rgba(0, 0, 0, 0.12)",
        3: "0px 0px 4px rgba(0, 0, 0, 0.15)",
        4: "0px 0px 2px rgba(0, 0, 0, 0.2)",
        5: "0px 1px 5px rgba(0, 0, 0, 0.2)",
      },

      keyframes: {
        linspin: {
          "100%": { transform: "rotate(360deg)" },
        },
        easespin: {
          "12.5%": { transform: "rotate(135deg)" },
          "25%": { transform: "rotate(270deg)" },
          "37.5%": { transform: "rotate(405deg)" },
          "50%": { transform: "rotate(540deg)" },
          "62.5%": { transform: "rotate(675deg)" },
          "75%": { transform: "rotate(810deg)" },
          "87.5%": { transform: "rotate(945deg)" },
          "100%": { transform: "rotate(1080deg)" },
        },
        "left-spin": {
          "0%": { transform: "rotate(130deg)" },
          "50%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(130deg)" },
        },
        "right-spin": {
          "0%": { transform: "rotate(-130deg)" },
          "50%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(-130deg)" },
        },
        rotating: {
          "0%, 100%": { transform: "rotate(360deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        topbottom: {
          "0%, 100%": { transform: "translate3d(0, -100%, 0)" },
          "50%": { transform: "translate3d(0, 0, 0)" },
        },
        bottomtop: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -100%, 0)" },
        },
        line: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(100%)" },
        },
        "line-revert": {
          "0%, 100%": { transform: "translateY(100%)" },
          "50%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "ai-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "ai-typing": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "counter-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      animation: {
        linspin: "linspin 1568.2353ms linear infinite",
        easespin: "easespin 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "left-spin": "left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "right-spin": "right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
        "ping-once": "ping 5s cubic-bezier(0, 0, 0.2, 1)",
        rotating: "rotating 30s linear infinite",
        topbottom: "topbottom 60s infinite alternate linear",
        bottomtop: "bottomtop 60s infinite alternate linear",
        "spin-1.5": "spin 1.5s linear infinite",
        "spin-2": "spin 2s linear infinite",
        "spin-3": "spin 3s linear infinite",
        line1: "line 10s infinite linear",
        line2: "line-revert 8s infinite linear",
        line3: "line 7s infinite linear",
        "fade-in": "fade-in 200ms ease-out",
        "fade-in-up": "fade-in-up 300ms ease-out",
        "slide-in-right": "slide-in-right 250ms ease-out",
        "slide-in-left": "slide-in-left 250ms ease-out",
        "scale-in": "scale-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "ai-pulse": "ai-pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "counter-up": "counter-up 400ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
