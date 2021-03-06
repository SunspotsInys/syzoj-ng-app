module.exports = {
  code_language: "[TBT] Language",
  cpp: {
    name: "[TBT] C++",
    options: {
      compiler: {
        name: "[TBT] Compiler",
        values: {
          "g++": "[TBT] G++",
          "clang++": "[TBT] Clang++"
        }
      },
      std: {
        name: "[TBT] C++ Standard",
        values: {
          "c++03": "[TBT] C++ 03",
          "c++11": "[TBT] C++ 11",
          "c++14": "[TBT] C++ 14",
          "c++17": "[TBT] C++ 17",
          "c++20": "[TBT] C++ 20"
        }
      },
      O: {
        name: "[TBT] Optimization",
        values: {
          0: "[TBT] -O0 (disable optimization)",
          1: "[TBT] -O1",
          2: "[TBT] -O2",
          3: "[TBT] -O3",
          fast: "[TBT] -Ofast (fastest)"
        }
      },
      m: {
        name: "[TBT] Architecture",
        values: {
          64: "[TBT] 64-bit",
          32: "[TBT] 32-bit",
          x32: "[TBT] 64-bit (with 32-bit pointers)"
        }
      }
    }
  },
  c: {
    name: "[TBT] C",
    options: {
      compiler: {
        name: "[TBT] Compiler",
        values: {
          gcc: "[TBT] GCC",
          clang: "[TBT] Clang"
        }
      },
      std: {
        name: "[TBT] C Standard",
        values: {
          c89: "[TBT] C89",
          c99: "[TBT] C99",
          c11: "[TBT] C11",
          c17: "[TBT] C17"
        }
      },
      O: {
        name: "[TBT] Optimization",
        values: {
          0: "[TBT] -O0 (disable optimization)",
          1: "[TBT] -O1",
          2: "[TBT] -O2",
          3: "[TBT] -O3",
          fast: "[TBT] -Ofast (fastest)"
        }
      },
      m: {
        name: "[TBT] Architecture",
        values: {
          64: "[TBT] 64-bit",
          32: "[TBT] 32-bit",
          x32: "[TBT] 64-bit (with 32-bit pointers)"
        }
      }
    }
  },
  java: {
    name: "[TBT] Java"
  },
  kotlin: {
    name: "[TBT] Kotlin",
    options: {
      version: {
        name: "[TBT] Version",
        values: {
          1.3: "[TBT] 1.3",
          1.4: "[TBT] 1.4",
          1.5: "[TBT] 1.5"
        }
      },
      platform: {
        name: "[TBT] Platform",
        values: {
          jvm: "[TBT] JVM"
        }
      }
    }
  },
  pascal: {
    name: "[TBT] Pascal",
    options: {
      optimize: {
        name: "[TBT] Optimization",
        values: {
          "-": "[TBT] Disabled",
          1: "[TBT] -O",
          2: "[TBT] -O2",
          3: "[TBT] -O3",
          4: "[TBT] -O4 (fastest)"
        }
      }
    }
  },
  python: {
    name: "[TBT] Python",
    options: {
      version: {
        name: "[TBT] Version",
        values: {
          2.7: "[TBT] 2.7",
          3.6: "[TBT] 3.6",
          3.9: "[TBT] 3.9"
        }
      }
    }
  },
  rust: {
    name: "[TBT] Rust",
    options: {
      version: {
        name: "[TBT] Version",
        values: {
          2015: "[TBT] 2015",
          2018: "[TBT] 2018"
        }
      },
      optimize: {
        name: "[TBT] Optimization",
        values: {
          0: "[TBT] Disabled",
          1: "[TBT] Level 1",
          2: "[TBT] Level 2",
          3: "[TBT] Level 3 (fastest)"
        }
      }
    }
  },
  go: {
    name: "[TBT] Go",
    options: {
      version: {
        name: "[TBT] Version",
        values: {
          "1.x": "[TBT] 1.x"
        }
      }
    }
  },
  haskell: {
    name: "[TBT] Haskell",
    options: {
      version: {
        name: "[TBT] Version",
        values: {
          98: "[TBT] Haskell 98",
          2010: "[TBT] Haskell 2010"
        }
      }
    }
  },
  csharp: {
    name: "[TBT] C#",
    options: {
      version: {
        name: "[TBT] Version",
        values: {
          7.3: "[TBT] 7.3",
          8: "[TBT] 8"
        }
      }
    }
  },
  fsharp: {
    name: "[TBT] F#"
  }
};
