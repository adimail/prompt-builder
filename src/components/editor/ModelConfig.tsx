import { useSettingsStore } from '../../store/settingsStore';
import { SimpleSlider } from '../ui/SimpleSlider';
import { ModelRadarChart } from './RadarChart';

export const ModelConfig = () => {
  const { temperature, topP, setTemperature, setTopP } = useSettingsStore();

  return (
    <div>
      <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 px-2 border-t border-neutral-800 pt-6">
        Model Configuration
      </h2>

      <ModelRadarChart temperature={temperature} topP={topP} />

      <div className="space-y-4 px-2 mt-4">
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
