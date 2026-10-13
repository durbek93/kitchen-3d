import { THREE } from '../three-global.js';
import { sunLight, ambientLight } from '../scene.js';

export const LAT_FERGANA_RAD = THREE.MathUtils.degToRad(40.35); // 40.35° с.ш.
export const AZ_GAZEBO_DEG = 66.0; // Азимут оси беседки (+X) в реальных координатах

export let currentSeason = 'summer'; // 'summer', 'equinox', 'winter'
export let sunHour = 13.0; // 13:00 (Полдень)
export let isSunPlaying = false;
export let sunPlaySpeed = 0.025; // шаг прокрутки часов за кадр



    const SEASONS = {
      summer: {
        id: 'summer',
        name: '☀️ Лето (Чилля / Июль)',
        declinationDeg: 21.5,
        riseHour: 5.4,
        setHour: 20.0,
        noonElevationDeg: 71.2,
        sliderMin: 5.5,
        sliderMax: 20.0,
        riseLabel: '05:30 (Восход)',
        setLabel: '20:00 (Закат)'
      },
      equinox: {
        id: 'equinox',
        name: '🌤️ Весна / Осень (Равноденствие)',
        declinationDeg: 0.0,
        riseHour: 6.0,
        setHour: 18.5,
        noonElevationDeg: 49.65,
        sliderMin: 6.0,
        sliderMax: 18.5,
        riseLabel: '06:00 (Восход)',
        setLabel: '18:30 (Закат)'
      },
      winter: {
        id: 'winter',
        name: '❄️ Зима (Декабрь / Январь)',
        declinationDeg: -23.0,
        riseHour: 7.4,
        setHour: 17.0,
        noonElevationDeg: 26.65,
        sliderMin: 7.5,
        sliderMax: 17.0,
        riseLabel: '07:30 (Восход)',
        setLabel: '17:00 (Закат)'
      }
    };

    function setSunSeason(seasonKey) {
      if (!SEASONS[seasonKey]) return;
      currentSeason = seasonKey;

      // Обновление переключателя сезонов
      ['summer', 'equinox', 'winter'].forEach(s => {
        const btn = document.getElementById('btn-season-' + s);
        if (btn) btn.classList.toggle('active', s === seasonKey);
      });

      const seasonLabel = document.getElementById('season-display');
      if (seasonLabel) seasonLabel.textContent = SEASONS[seasonKey].name;

      const riseLabel = document.getElementById('sun-rise-label');
      const setLabel = document.getElementById('sun-set-label');
      const slider = document.getElementById('sun-slider');
      if (riseLabel) riseLabel.textContent = SEASONS[seasonKey].riseLabel;
      if (setLabel) setLabel.textContent = SEASONS[seasonKey].setLabel;
      if (slider) {
        slider.min = SEASONS[seasonKey].sliderMin;
        slider.max = SEASONS[seasonKey].sliderMax;
        if (sunHour < parseFloat(slider.min)) sunHour = parseFloat(slider.min);
        if (sunHour > parseFloat(slider.max)) sunHour = parseFloat(slider.max);
        slider.value = sunHour;
      }

      updateSun(sunHour, true);
      updatePresetButtons(sunHour);
    }

    function calculateSunPosition(hour, seasonKey) {
      const cfg = SEASONS[seasonKey] || SEASONS.summer;
      const declRad = THREE.MathUtils.degToRad(cfg.declinationDeg);
      const latRad = LAT_FERGANA_RAD;

      // Часовой угол солнца: в Фергане истинный солнечный полдень наступает около 12:45 местного времени (UTC+5)
      const hourAngleRad = (hour - 12.75) * THREE.MathUtils.degToRad(15.0);

      // Высота солнца над горизонтом (Elevation angle)
      const sinElev = Math.sin(latRad) * Math.sin(declRad) + Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourAngleRad);
      const elevRad = Math.asin(Math.max(-0.25, Math.min(1.0, sinElev)));

      // Азимут солнца от точки Севера (0°=Север, 90°=Восток, 180°=Юг, 270°=Запад)
      const y = Math.sin(hourAngleRad);
      const x = Math.cos(hourAngleRad) * Math.sin(latRad) - Math.tan(declRad) * Math.cos(latRad);
      let azRad = Math.atan2(y, x) + Math.PI;
      if (azRad < 0) azRad += Math.PI * 2;
      if (azRad >= Math.PI * 2) azRad -= Math.PI * 2;

      // Перевод в 3D координаты модели:
      // Азимут относительно оси беседки (+X, 66° ВСВ)
      const azBuildingRad = azRad - THREE.MathUtils.degToRad(AZ_GAZEBO_DEG);

      const radius = 55.0;
      const clampedElev = Math.max(0.035, elevRad);
      const cosElev = Math.cos(clampedElev);

      const sunX = radius * cosElev * Math.cos(azBuildingRad);
      const sunZ = -radius * cosElev * Math.sin(azBuildingRad);
      const sunY = radius * Math.sin(clampedElev);

      return {
        x: sunX,
        y: sunY,
        z: sunZ,
        elevationDeg: THREE.MathUtils.radToDeg(elevRad),
        azimuthDeg: THREE.MathUtils.radToDeg(azRad),
        isDaylight: elevRad > 0.015
      };
    }

    function updateSun(hour, updateUI = true) {
      const cfg = SEASONS[currentSeason] || SEASONS.summer;
      sunHour = Math.max(parseFloat(cfg.sliderMin), Math.min(parseFloat(cfg.sliderMax), hour));

      const sunPos = calculateSunPosition(sunHour, currentSeason);

      sunLight.position.set(sunPos.x, sunPos.y, sunPos.z);
      sunLight.target.position.set(0, 1.2, 0);
      sunLight.target.updateMatrixWorld();

      // Освещение и цветовая температура атмосферы Ферганы
      let sunColor, ambientIntensity, sunIntensity;
      const elev = sunPos.elevationDeg;

      if (elev < 8.0) {
        // Заря / закат у горизонта (теплый медно-оранжевый свет)
        const f = Math.max(0, elev) / 8.0;
        sunColor = new THREE.Color(0xff6b35).lerp(new THREE.Color(0xffaa5e), f);
        sunIntensity = 0.40 + f * 0.70;
        ambientIntensity = 0.35 + f * 0.25;
      } else if (elev < 25.0) {
        // Утро / вечер (золотисто-теплый)
        const f = (elev - 8.0) / 17.0;
        sunColor = new THREE.Color(0xffaa5e).lerp(new THREE.Color(0xfff3d6), f);
        sunIntensity = 1.10 + f * 0.35;
        ambientIntensity = 0.60 + f * 0.15;
      } else {
        // Дневное южное солнце Ферганы (яркий чистый свет)
        sunColor = new THREE.Color(0xfffaed);
        sunIntensity = 1.55;
        ambientIntensity = 0.78;
      }

      sunLight.color.copy(sunColor);
      sunLight.intensity = sunIntensity;
      ambientLight.intensity = ambientIntensity;

      // Теплый интерьерный свет комнат усиливается утром и в сумерках
      const isDusk = elev < 12.0;
      const intBoost = isDusk ? 1.6 : 0.9;
      intStudioLight1.intensity = 1.4 * intBoost;
      intStudioLight2.intensity = 1.4 * intBoost;
      intGazeboLight.intensity = 0.9 * intBoost;
      intSummerLight.intensity = 0.9 * intBoost;
      intUtilityLight.intensity = 1.1 * intBoost;

      if (updateUI) {
        const slider = document.getElementById('sun-slider');
        if (slider) slider.value = sunHour;

        const timeLabel = document.getElementById('sun-time-display');
        const descLabel = document.getElementById('sun-desc-display');
        if (timeLabel) {
          const h = Math.floor(sunHour);
          const m = Math.floor((sunHour - h) * 60);
          timeLabel.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
        if (descLabel) {
          const az = Math.round(sunPos.azimuthDeg);
          const el = Math.round(sunPos.elevationDeg);
          if (sunHour <= 8.5) {
            descLabel.textContent = `🌅 Утро (${el}° над горизонтом, азимут ${az}°): солнце встает над беседкой (Восток), утренние лучи приятно согревают террасу`;
          } else if (sunHour <= 11.5) {
            descLabel.textContent = `☀️ Первая половина дня (${el}°, азимут ${az}°): солнце переходит на Юго-Восток, прогревает заднюю глухую стену`;
          } else if (sunHour <= 14.5) {
            descLabel.textContent = `☀️ Полдень (${el}° зенит, азимут ${az}°): солнце на Юге прямо за задней стеной! Здание закрывает собой двор — терраса и беседка в спасительной тени`;
          } else if (sunHour <= 17.5) {
            descLabel.textContent = `🌤️ Вторая половина дня (${el}°, азимут ${az}°): солнце смещается на Юго-Запад к летней кухне, защищая витражи зимней кухни от перегрева`;
          } else {
            descLabel.textContent = `🌇 Закат (${el}°, азимут ${az}°): мягкие закатные лучи с Северо-Запада освещают фасад зимней кухни и санузла`;
          }
        }
      }
    }

    function setSunTimeFromSlider(val) {
      if (isSunPlaying) toggleSunAnimation();
      updateSun(parseFloat(val), true);
      updatePresetButtons(parseFloat(val));
    }

    function setSunPreset(hour) {
      if (isSunPlaying) toggleSunAnimation();
      updateSun(hour, true);
      updatePresetButtons(hour);
    }

    function updatePresetButtons(hour) {
      const presets = [
        { id: 'sun-btn-8', val: 8.0 },
        { id: 'sun-btn-13', val: 13.0 },
        { id: 'sun-btn-17', val: 17.0 },
        { id: 'sun-btn-19', val: 19.3 }
      ];
      presets.forEach(p => {
        const btn = document.getElementById(p.id);
        if (btn) btn.classList.toggle('active', Math.abs(p.val - hour) < 0.9);
      });
    }

    function toggleSunAnimation() {
      isSunPlaying = !isSunPlaying;
      const btn = document.getElementById('btn-sun-play');
      if (btn) {
        btn.innerHTML = isSunPlaying ? '⏸ Пауза дня' : '▶ Запустить день (движение теней)';
        btn.classList.toggle('active', isSunPlaying);
      }
    }



export function stepSunAnimation() {
  if (!isSunPlaying) return;
  const cfg = SEASONS[currentSeason] || SEASONS.summer;
  sunHour += sunPlaySpeed;
  if (sunHour > parseFloat(cfg.sliderMax)) sunHour = parseFloat(cfg.sliderMin);
  updateSun(sunHour, true);
  updatePresetButtons(sunHour);
}

export {
  SEASONS,
  setSunSeason,
  calculateSunPosition,
  updateSun,
  setSunTimeFromSlider,
  setSunPreset,
  updatePresetButtons,
  toggleSunAnimation
};
