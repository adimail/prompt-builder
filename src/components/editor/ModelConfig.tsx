import { useSettingsStore } from '../../store/settingsStore';
import { SimpleSlider } from '../ui/SimpleSlider';
import { ModelRadarChart } from './RadarChart';

export const ModelConfig = () => {
  const { temperature, topP, setTemperature, setTopP } = useSettingsStore();

  return (
    <div>
      <h2 className="mb-3 border-t border-neutral-800 px-2 pt-6 text-sm font-medium uppercase tracking-wider text-neutral-400">
        Model Configuration
      </h2>

      <ModelRadarChart temperature={temperature} topP={topP} />

      <div className="mt-4 space-y-4 px-2">
        <SimpleSlider
          id="temperature"
          label="Temperature"
          value={temperature}
          min={0}
          max={1}
          step={0.01}
          onChange={setTemperature}
          displayValue={temperature.toFixed(2)}
        />
        <SimpleSlider
          id="topP"
          label="Top-P"
          value={topP}
          min={0}
          max={1}
          step={0.01}
          onChange={setTopP}
          displayValue={topP.toFixed(2)}
        />
      </div>
    </div>
  );
};
