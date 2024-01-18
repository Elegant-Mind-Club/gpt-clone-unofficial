import { SelectDropDown, SelectDropDownPop } from '~/components/ui';
import type { TModelSelectProps } from '~/common';
import { cn, cardStyle } from '~/utils/';
import GPTSwitch from '~/components/Input/ModelSelect/GPTSwitch';

export default function OpenAI({
  conversation,
  setOption,
  models,
  showAbove = true,
  popover = false,
}: TModelSelectProps) {
  const Menu = popover ? SelectDropDownPop : SelectDropDown;
  // Display switch if models only include "gpt-3.5-turbo-1106" and "gpt-4-1106-preview"
  // Otherwise, display dropdown
  const switchModels = ['gpt-3.5-turbo-1106', 'gpt-4-1106-preview'];
  const gpt3Model = switchModels[0];
  const gpt4Model = switchModels[1];

  return (
    <div>
      {/* If only the gpt3.5 and gpt4 models, display switch. Otherwise, display dropdown*/}
      {JSON.stringify(models) === JSON.stringify(switchModels) ? (
        <GPTSwitch
          conversation={conversation}
          setOption={setOption}
          models={models}
          gpt3Model={gpt3Model}
          gpt4Model={gpt4Model}
        />
      ) : (
        <Menu
          value={conversation?.model ?? ''}
          setValue={setOption('model')}
          availableValues={models}
          showAbove={showAbove}
          showLabel={false}
          className={cn(
            cardStyle,
            'min-w-48 z-50 flex h-[40px] w-48 flex-none items-center justify-center px-4 hover:cursor-pointer',
          )}
        />
      )}
    </div>
  );
}
